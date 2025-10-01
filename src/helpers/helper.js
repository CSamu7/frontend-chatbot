const getCsrfCookie = () => {
  const splitCookie = document.cookie.split("=");

  console.log(splitCookie);
  console.log(document.cookie);

  for (const cookie of document.cookie) {
    console.log(cookie);
  }

  const indexCookie = splitCookie.findIndex((cookie) =>
    cookie.startsWith("csrf")
  );

  return splitCookie[indexCookie + 1];
};

const createCsrfHeaders = () => {
  const csrf = getCsrfCookie();

  console.log(csrf);

  return new Headers({
    "Content-Type": "x-www-form-urlencoded",
    "X-CSRFToken": csrf,
  });
};

export { createCsrfHeaders };
