import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Typography,
  Drawer,
  Tabs,
  Divider,
  Empty
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  FolderOutlined,
  TagsOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useMessage } from "../../hooks";
import { trpc } from "../../lib/trpc";
import type {
  TestRequirement,
  TestRequirementStatus,
  TestRequirementType,
  TestRequirementPriority
} from "@acme/types";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 状态配置
const STATUS_CONFIG: Record<
  TestRequirementStatus,
  { labelKey: string; color: string; icon: React.ReactNode }
> = {
  draft: {
    labelKey: "draft",
    color: "default",
    icon: <FileTextOutlined />
  },
  pending: {
    labelKey: "pending",
    color: "processing",
    icon: <ClockCircleOutlined />
  },
  approved: {
    labelKey: "approved",
    color: "cyan",
    icon: <CheckCircleOutlined />
  },
  in_progress: {
    labelKey: "in_progress",
    color: "blue",
    icon: <ClockCircleOutlined />
  },
  completed: {
    labelKey: "completed",
    color: "success",
    icon: <CheckCircleOutlined />
  },
  rejected: {
    labelKey: "rejected",
    color: "error",
    icon: <CloseCircleOutlined />
  },
  cancelled: {
    labelKey: "cancelled",
    color: "default",
    icon: <CloseCircleOutlined />
  }
};

// 类型配置
const TYPE_CONFIG: Record<
  TestRequirementType,
  { labelKey: string; color: string }
> = {
  functional: { labelKey: "functional", color: "blue" },
  performance: { labelKey: "performance", color: "orange" },
  security: { labelKey: "security", color: "red" },
  usability: { labelKey: "usability", color: "purple" },
  compatibility: { labelKey: "compatibility", color: "cyan" },
  integration: { labelKey: "integration", color: "geekblue" },
  regression: { labelKey: "regression", color: "magenta" }
};

// 优先级配置
const PRIORITY_CONFIG: Record<
  TestRequirementPriority,
  { labelKey: string; color: string }
> = {
  critical: { labelKey: "critical", color: "red" },
  high: { labelKey: "high", color: "orange" },
  medium: { labelKey: "medium", color: "blue" },
  low: { labelKey: "low", color: "green" }
};

export default function TestRequirementsPage() {
  const { workspace } = useParams<{ workspace: string }>();
  const message = useMessage();
  const { t } = useTranslation();
  // Helper to get testRequirements namespace translations
  const tr = (key: string, options?: Record<string, unknown>) => t(`dashboard.testRequirements.${key}`, options);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TestRequirement | null>(null);
  const [viewingRecord, setViewingRecord] = useState<TestRequirement | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<TestRequirementStatus | undefined>();
  const [filterType, setFilterType] = useState<TestRequirementType | undefined>();
  const [filterPriority, setFilterPriority] = useState<TestRequirementPriority | undefined>();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [form] = Form.useForm();
  const utils = trpc.useUtils();

  // 查询列表
  const listQuery = trpc.testRequirement.list.useQuery(
    {
      keyword: searchKeyword || undefined,
      status: filterStatus,
      type: filterType,
      priority: filterPriority,
      page: pagination.page,
      pageSize: pagination.pageSize
    },
    { enabled: Boolean(workspace) }
  );

  // 创建
  const createMutation = trpc.testRequirement.create.useMutation({
    onSuccess: async () => {
      message.success(tr("toastCreateSuccess"));
      setIsModalOpen(false);
      form.resetFields();
      await utils.testRequirement.list.invalidate();
    },
    onError: (error) => {
      message.error(error.message || tr("toastCreateFail"));
    }
  });

  // 更新
  const updateMutation = trpc.testRequirement.update.useMutation({
    onSuccess: async () => {
      message.success(tr("toastUpdateSuccess"));
      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
      await utils.testRequirement.list.invalidate();
    },
    onError: (error) => {
      message.error(error.message || tr("toastUpdateFail"));
    }
  });

  // 删除
  const deleteMutation = trpc.testRequirement.delete.useMutation({
    onSuccess: async () => {
      message.success(tr("toastDeleteSuccess"));
      await utils.testRequirement.list.invalidate();
    },
    onError: (error) => {
      message.error(error.message || tr("toastDeleteFail"));
    }
  });

  // 打开新建弹窗
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      type: "functional",
      status: "draft",
      priority: "medium"
    });
    setIsModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: TestRequirement) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : undefined,
      tags: record.tags?.join(",")
    });
    setIsModalOpen(true);
  };

  // 查看详情
  const handleView = (record: TestRequirement) => {
    setViewingRecord(record);
    setIsDetailOpen(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        dueDate: values.dueDate?.toISOString(),
        tags: values.tags
          ? values.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : undefined
      };

      if (editingRecord) {
        await updateMutation.mutateAsync({ id: editingRecord.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      // Form validation error
    }
  };

  // 删除确认
  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
  };

  // 刷新
  const handleRefresh = () => {
    utils.testRequirement.list.invalidate();
  };

  // 统计数据
  const stats = {
    total: listQuery.data?.total ?? 0,
    draft: 0,
    inProgress: 0,
    completed: 0
  };

  if (listQuery.data?.items) {
    for (const item of listQuery.data.items) {
      if (item.status === "draft") stats.draft++;
      if (item.status === "in_progress") stats.inProgress++;
      if (item.status === "completed") stats.completed++;
    }
  }

  // 表格列定义
  const columns: ColumnsType<TestRequirement> = [
    {
      title: tr("requirementId"),
      dataIndex: "code",
      key: "code",
      width: 120,
      fixed: "left",
      render: (code: string) => (
        <Text strong style={{ color: "#1890ff", fontFamily: "monospace" }}>
          {code}
        </Text>
      )
    },
    {
      title: tr("requirementName"),
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{title}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
              {record.description}
            </Text>
          )}
        </Space>
      )
    },
    {
      title: tr("type"),
      dataIndex: "type",
      key: "type",
      width: 110,
      render: (type: TestRequirementType) => (
        <Tag color={TYPE_CONFIG[type]?.color}>
          {tr(`typeLabels.${TYPE_CONFIG[type]?.labelKey}`)}
        </Tag>
      )
    },
    {
      title: tr("priority"),
      dataIndex: "priority",
      key: "priority",
      width: 90,
      render: (priority: TestRequirementPriority) => (
        <Tag color={PRIORITY_CONFIG[priority]?.color} style={{ margin: 0 }}>
          {tr(`priorityLabels.${PRIORITY_CONFIG[priority]?.labelKey}`)}
        </Tag>
      )
    },
    {
      title: tr("status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: TestRequirementStatus) => (
        <Tag
          icon={STATUS_CONFIG[status]?.icon}
          color={STATUS_CONFIG[status]?.color}
        >
          {tr(`statusLabels.${STATUS_CONFIG[status]?.labelKey}`)}
        </Tag>
      )
    },
    {
      title: tr("creatorName"),
      dataIndex: "creatorName",
      key: "creatorName",
      width: 100,
      render: (name: string | null) => name || "-"
    },
    {
      title: tr("assigneeName"),
      dataIndex: "assigneeName",
      key: "assigneeName",
      width: 100,
      render: (name: string | null) => name || "-"
    },
    {
      title: tr("children"),
      dataIndex: "childrenCount",
      key: "childrenCount",
      width: 80,
      align: "center",
      render: (count: number) =>
        count > 0 ? (
          <Tag color="purple" icon={<FolderOutlined />}>
            {count}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        )
    },
    {
      title: tr("createdTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: Date) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-"
    },
    {
      title: tr("action"),
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={tr("view")}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title={tr("edit")}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={tr("removeTitle")}
            description={tr("removeDesc")}
            onConfirm={() => handleDelete(record.id)}
            okText={tr("removeOk")}
            cancelText={tr("removeCancel")}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={tr("remove")}>
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const statsCards = [
    {
      title: tr("titleTotal"),
      value: stats.total,
      icon: <FileTextOutlined />,
      className:
        "bg-gradient-to-br from-stats-total-from to-stats-total-to dark:from-stats-total-from-dark dark:to-stats-total-to-dark"
    },
    {
      title: tr("titleDraft"),
      value: stats.draft,
      icon: <EditOutlined />,
      className:
        "bg-gradient-to-br from-stats-draft-from to-stats-draft-to dark:from-stats-draft-from-dark dark:to-stats-draft-to-dark"
    },
    {
      title: tr("titleInProgress"),
      value: stats.inProgress,
      icon: <ClockCircleOutlined />,
      className:
        "bg-gradient-to-br from-stats-progress-from to-stats-progress-to dark:from-stats-progress-from-dark dark:to-stats-progress-to-dark"
    },
    {
      title: tr("titleDone"),
      value: stats.completed,
      icon: <CheckCircleOutlined />,
      className:
        "bg-gradient-to-br from-stats-done-from to-stats-done-to dark:from-stats-done-from-dark dark:to-stats-done-to-dark"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-lg p-6 shadow-sm ${card.className}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/90 text-sm mb-2">{card.title}</div>
                <div className="text-white text-3xl font-semibold">{card.value}</div>
              </div>
              <div className="text-white/80 text-2xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 工具栏 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space wrap>
            <Input.Search
              placeholder={tr("searchPlaceholder")}
              allowClear
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onSearch={(value) => setSearchKeyword(value)}
              onChange={(e) => !e.target.value && setSearchKeyword("")}
            />
            <Select
              placeholder={tr("filterStatus")}
              allowClear
              style={{ width: 120 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={Object.entries(STATUS_CONFIG).map(([key, val]) => ({
                value: key,
                label: tr(`statusLabels.${val.labelKey}`)
              }))}
            />
            <Select
              placeholder={tr("filterType")}
              allowClear
              style={{ width: 120 }}
              value={filterType}
              onChange={setFilterType}
              options={Object.entries(TYPE_CONFIG).map(([key, val]) => ({
                value: key,
                label: tr(`typeLabels.${val.labelKey}`)
              }))}
            />
            <Select
              placeholder={tr("filterPriority")}
              allowClear
              style={{ width: 100 }}
              value={filterPriority}
              onChange={setFilterPriority}
              options={Object.entries(PRIORITY_CONFIG).map(([key, val]) => ({
                value: key,
                label: tr(`priorityLabels.${val.labelKey}`)
              }))}
            />
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              {tr("refresh")}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              {tr("create")}
            </Button>
          </Space>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <Table<TestRequirement>
          columns={columns}
          dataSource={(listQuery.data?.items ?? []) as TestRequirement[]}
          rowKey="id"
          loading={listQuery.isLoading}
          scroll={{ x: 1300 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: listQuery.data?.total ?? 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => tr("totalCount", { count: total }),
            onChange: (page, pageSize) => setPagination({ page, pageSize })
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/30" : ""
          }
        />
      </div>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingRecord ? tr("modalEdit") : tr("modalCreate")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        width={800}
        okText={editingRecord ? tr("modalOkSave") : tr("modalOkCreate")}
        cancelText={tr("removeCancel")}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label={tr("fieldTitle")}
                rules={[{ required: true, message: tr("fieldTitleRequired") }]}
              >
                <Input placeholder={tr("fieldTitle")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label={tr("fieldType")} initialValue="functional">
                <Select
                  options={Object.entries(TYPE_CONFIG).map(([key, val]) => ({
                    value: key,
                    label: tr(`typeLabels.${val.labelKey}`)
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label={tr("fieldDesc")}>
            <TextArea rows={2} placeholder={tr("fieldDesc")} />
          </Form.Item>

          <Form.Item name="content" label={tr("fieldContent")}>
            <TextArea
              rows={8}
              placeholder={tr("markdownPlaceholder")}
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="priority" label={tr("fieldPriority")} initialValue="medium">
                <Select
                  options={Object.entries(PRIORITY_CONFIG).map(([key, val]) => ({
                    value: key,
                    label: tr(`priorityLabels.${val.labelKey}`)
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label={tr("fieldStatus")} initialValue="draft">
                <Select
                  options={Object.entries(STATUS_CONFIG).map(([key, val]) => ({
                    value: key,
                    label: (
                      <Space>
                        {val.icon}
                        {tr(`statusLabels.${val.labelKey}`)}
                      </Space>
                    )
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dueDate" label={tr("fieldDueDate")}>
                <DatePicker style={{ width: "100%" }} placeholder={tr("dueDatePlaceholder")} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="estimatedHours" label={tr("fieldEstimate")}>
                <InputNumber
                  min={0}
                  step={0.5}
                  style={{ width: "100%" }}
                  placeholder={tr("fieldEstimate")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tags" label={tr("fieldTags")}>
                <Input placeholder={tr("tagsPlaceholder")} prefix={<TagsOutlined />} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title={
          <Space>
            <Text strong style={{ color: "#1890ff", fontFamily: "monospace" }}>
              {viewingRecord?.code}
            </Text>
            <Text>{viewingRecord?.title}</Text>
          </Space>
        }
        placement="right"
        width={640}
        open={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingRecord(null);
        }}
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsDetailOpen(false);
              if (viewingRecord) handleEdit(viewingRecord);
            }}
          >
            {tr("edit")}
          </Button>
        }
      >
        {viewingRecord && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Tag color={TYPE_CONFIG[viewingRecord.type]?.color}>
                {tr(`typeLabels.${TYPE_CONFIG[viewingRecord.type]?.labelKey}`)}
              </Tag>
              <Tag
                icon={STATUS_CONFIG[viewingRecord.status]?.icon}
                color={STATUS_CONFIG[viewingRecord.status]?.color}
              >
                {tr(`statusLabels.${STATUS_CONFIG[viewingRecord.status]?.labelKey}`)}
              </Tag>
              <Tag color={PRIORITY_CONFIG[viewingRecord.priority]?.color}>
                {tr(`priorityLabels.${PRIORITY_CONFIG[viewingRecord.priority]?.labelKey}`)}
              </Tag>
            </div>

            <Divider />

            <Tabs defaultActiveKey="info">
              <TabPane tab={tr("detailTabInfo")} key="info">
                <div className="space-y-3">
                  <div>
                    <Text type="secondary">{tr("fieldDesc")}：</Text>
                    <Paragraph>{viewingRecord.description || tr("descEmpty")}</Paragraph>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">{tr("creator")}：</Text>
                      <Text className="ml-2">{viewingRecord.creatorName || "-"}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">{tr("assignee")}：</Text>
                      <Text className="ml-2">{viewingRecord.assigneeName || "-"}</Text>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">{tr("estimate")}：</Text>
                      <Text className="ml-2">
                        {viewingRecord.estimatedHours
                          ? `${viewingRecord.estimatedHours} ${tr("hours")}`
                          : "-"}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">{tr("actual")}：</Text>
                      <Text className="ml-2">
                        {viewingRecord.actualHours
                          ? `${viewingRecord.actualHours} ${tr("hours")}`
                          : "-"}
                      </Text>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">{tr("createdAt")}：</Text>
                      <Text className="ml-2">
                        {viewingRecord.createdAt
                          ? dayjs(viewingRecord.createdAt).format("YYYY-MM-DD HH:mm")
                          : "-"}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">{tr("dueDate")}：</Text>
                      <Text className="ml-2">
                        {viewingRecord.dueDate
                          ? dayjs(viewingRecord.dueDate).format("YYYY-MM-DD")
                          : "-"}
                      </Text>
                    </Col>
                  </Row>
                  {viewingRecord.tags && viewingRecord.tags.length > 0 && (
                    <div>
                      <Text type="secondary">{tr("fieldTags")}：</Text>
                      <div className="mt-1">
                        {viewingRecord.tags.map((tag) => (
                          <Tag key={tag} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabPane>
              <TabPane tab={tr("detailTabContent")} key="content">
                {viewingRecord.content ? (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
                  >
                    {viewingRecord.content}
                  </div>
                ) : (
                  <Empty description={tr("contentEmpty")} />
                )}
              </TabPane>
              <TabPane
                tab={
                  <Space>
                    {tr("detailTabChildren")}
                    {(viewingRecord.childrenCount ?? 0) > 0 && (
                      <Tag color="purple">{viewingRecord.childrenCount}</Tag>
                    )}
                  </Space>
                }
                key="children"
              >
                {(viewingRecord.childrenCount ?? 0) > 0 ? (
                  <Text type="secondary">
                    {tr("childrenCount", { count: viewingRecord.childrenCount ?? 0 })}
                  </Text>
                ) : (
                  <Empty description={tr("childrenEmpty")} />
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>
    </div>
  );
}
