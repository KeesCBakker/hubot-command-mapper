interface IResponse {
  reply(text: string);

  message: {
    text: string;
    user: {
      id: string;
      name: string;
    };
  };
}
