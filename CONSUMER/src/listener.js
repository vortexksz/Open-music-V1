class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const playlist = JSON.parse(message.content.toString());
      const { playlistId, targetEmail } = playlist;

      const data = await this._playlistsService.getPlaylistSongs(playlistId);

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(data),
      );

      console.log(`[EMAIL SENT] to ${targetEmail}. Result: ${result}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export default Listener;
