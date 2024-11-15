const isUserRejectedError = (error: unknown) => {
  if (error instanceof Error) {
    if (/user rejected|user declined/i.test(error.message.toLowerCase())) {
      return true;
    }
  }
  return false;
};

export default isUserRejectedError;
