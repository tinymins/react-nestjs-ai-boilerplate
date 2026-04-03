import { type Language, t } from "@/i18n";

type ZodIssueLike = {
  code: string;
  path: (string | number)[];
  message: string;
  minimum?: number | bigint;
  maximum?: number | bigint;
  type?: string;
};

function formatIssue(issue: ZodIssueLike, language: Language): string {
  const fieldKey = issue.path.length > 0 ? String(issue.path[0]) : "";
  const translated = t(language, `common.validation.fields.${fieldKey}`);
  // t() returns the key path when not found — fall back to raw fieldKey
  const field =
    translated !== `common.validation.fields.${fieldKey}`
      ? translated
      : fieldKey;

  if (language === "en") {
    return issue.message;
  }

  // Chinese formatting
  switch (issue.code) {
    case "too_small":
      if (issue.minimum != null) {
        return field
          ? `${field}至少需要 ${issue.minimum} 个字符`
          : `至少需要 ${issue.minimum} 个字符`;
      }
      return field ? `${field}不能为空` : "不能为空";
    case "too_big":
      if (issue.maximum != null) {
        return field
          ? `${field}不能超过 ${issue.maximum} 个字符`
          : `不能超过 ${issue.maximum} 个字符`;
      }
      return field ? `${field}超出限制` : "超出限制";
    case "invalid_string":
      return field ? `${field}格式不正确` : "格式不正确";
    case "invalid_type":
      return field ? `${field}不能为空` : "不能为空";
    case "invalid_enum_value":
      return field ? `${field}值不合法` : "值不合法";
    default:
      return issue.message;
  }
}

export function formatZodError(
  issues: ZodIssueLike[],
  language: Language,
): string {
  const sep = language === "zh" ? "；" : "; ";
  return issues.map((issue) => formatIssue(issue, language)).join(sep);
}
