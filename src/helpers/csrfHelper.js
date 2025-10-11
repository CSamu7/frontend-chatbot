const getCsrfCookie = () => {
  const splitCookies = document.cookie
    .split(";")
    .map((cookie) => cookie.trim());

  const csrfIndex = splitCookies.findIndex((cookie) =>
    cookie.startsWith("csrf")
  );

  const csrfValue = splitCookies[csrfIndex].split("=")[1];

  return csrfValue;
};

const createCsrfHeaders = () => {
  const csrf = getCsrfCookie();

  return new Headers({
    "Content-Type": "x-www-form-urlencoded",
    "X-CSRFToken": csrf,
  });
};

export { createCsrfHeaders };
