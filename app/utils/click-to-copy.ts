export const copy = (
  data: string,
  onSuccess?: Function,
  onError?: Function
) => {
  if (onSuccess && !onError) {
    navigator.clipboard.writeText(data).then(() => onSuccess());
    return;
  }

  if (!onSuccess && onError) {
    navigator.clipboard.writeText(data).catch(() => onError());
    return;
  }

  if (onSuccess && onError) {
    navigator.clipboard
      .writeText(data)
      .then(() => onSuccess())
      .catch(() => onError());
    return;
  }
};
