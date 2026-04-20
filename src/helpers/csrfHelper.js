const getCsrfCookie = () => {
  const splitCookies = document.cookie
    .split(";")
    .map((cookie) => cookie.trim());

  const csrfCookie = splitCookies.find((cookie) =>
    cookie.startsWith("csrftoken=")
  );

  if (!csrfCookie) return null;
  
  const csrfValue = csrfCookie.split("=")[1];
  return csrfValue;
};

const createCsrfHeaders = () => {
  const csrf = getCsrfCookie();
  const headers = new Headers();
  
  headers.set("Content-Type", "application/json");
  
  if (csrf) {
    headers.set("X-CSRFToken", csrf);
  }
  
  return headers;
};

export { createCsrfHeaders };