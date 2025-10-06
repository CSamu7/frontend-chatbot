const getCsrfCookie = () => {
  const splitCookie = document.cookie.split("=");

  const indexCookie = splitCookie.findIndex((cookie) =>
    cookie.startsWith("csrf")
  );

  return splitCookie[indexCookie + 1];
};

const createCsrfHeaders = () => {
  const csrf = getCsrfCookie();

  return new Headers({
    "Content-Type": "x-www-form-urlencoded",
    "X-CSRFToken": csrf,
  });
};

export { createCsrfHeaders };
