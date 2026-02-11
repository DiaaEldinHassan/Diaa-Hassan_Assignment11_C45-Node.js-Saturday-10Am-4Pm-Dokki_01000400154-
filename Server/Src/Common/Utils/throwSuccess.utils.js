export function throwSuccess(message, data, token = "") {
  return { message, data: { data, token } };
}
