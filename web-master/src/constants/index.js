import ERRORS from "./errorsMessage";

const VALIDATE_COMMON = {
  PASSWORD: {
    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,32}$/,
    message:
      "Password including UPPER, lowercase, symbol and numbers. Character lengths from 6 to 32.",
  },
};

const STATUS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Không duyệt",
  DELETED: "Đã xoá",
  HIDDEN: "Đã ẩn",
};

const STATUS_COLOR = (status) => {
  switch (status) {
    case STATUS.PENDING:
      return "processing"
    case STATUS.APPROVED:
      return "success"
    case STATUS.REJECTED:
      return "warning"
    case STATUS.DELETED:
      return "red"
    default:
      return "yellow"
  }
}

const SELL_CATEGORY = {
  CLOTHES: "Thời trang",
  HOUSEWARE: "Đồ gia dụng",
  LEARNING_TOOL: "Đồ dùng học tập",
};

const POST_CATEGORY = {
  TRAVEL: "Du lịch",
  LIFE_EXPERIENCE: "Kinh nghiệm sống",
  LEARNING_EXPERIENCE: "Kinh nghiệm học tập"
};

const COLLECTION = {
  HOSTEL: "hostels",
  SELLING: "sellings",
  SHARED_EXPERIENCE: "posts"
};

const ERRORS_MESSAGE = ERRORS.ERRORS_MESSAGE;

export default {
  // Cookies key
  CK_TOKEN: "CK_TOKEN",
  CK_USER: "CK_USER",
  CK_DATA: "CK_DATA",

  //MULTI LANG
  LANG: "MULTI_LANG",

  STATUS,
  STATUS_COLOR,

  SELL_CATEGORY,
  POST_CATEGORY,

  // Firestore collection
  COLLECTION,

  ERRORS_MESSAGE,
  VALIDATE_COMMON,
};
