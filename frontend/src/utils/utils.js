export const getSender = (field, loggedUser, members) => {
    return members[0]?._id === loggedUser?._id
      ? members[1][field]
      : members[0][field];
  };

export const getSenderFull = (loggedUser, members) => {
    return members[0]?._id === loggedUser?._id
      ? members[1]
      : members[0];
}


export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getTime = (date) => {
  let d = new Date(date);
  let pm = d.getHours() >= 12;
  let hour12 = d.getHours() % 12;
  if (!hour12) hour12 += 12;
  let minute = d.getMinutes();
  return `${hour12.toString().padStart(2, 0)}:${minute
    .toString()
    .padStart(2, 0)} ${pm ? "pm" : "am"}`;
};