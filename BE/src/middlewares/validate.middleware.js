const Joi = require("joi");

const translateJoiError = (detail) => {
  const field = detail.context?.label || detail.context?.key || "Dữ liệu";
  switch (detail.type) {
    case "any.required":
      return `'${field}' là thông tin bắt buộc`;
    case "string.empty":
      return `'${field}' không được để trống`;
    case "string.email":
      return `'${field}' phải là địa chỉ email hợp lệ`;
    case "string.min":
      return `'${field}' phải chứa ít nhất ${detail.context?.limit} ký tự`;
    case "string.max":
      return `'${field}' không được vượt quá ${detail.context?.limit} ký tự`;
    case "number.base":
      return `'${field}' phải là một số hợp lệ`;
    case "number.min":
      return `'${field}' phải lớn hơn hoặc bằng ${detail.context?.limit}`;
    case "number.max":
      return `'${field}' phải nhỏ hơn hoặc bằng ${detail.context?.limit}`;
    case "any.only":
      return `'${field}' phải là một trong các giá trị cho phép`;
    case "object.unknown":
      return `'${field}' không được phép gửi lên hệ thống`;
    default:
      return detail.message.replace(/"/g, "'");
  }
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map(translateJoiError)
        .join("; ");

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Dữ liệu không hợp lệ: ${errorMessage}`
      });
    }

    next();
  };
};

module.exports = validate;

