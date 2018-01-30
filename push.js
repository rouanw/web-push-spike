module.exports = (webpush) => {
  const triggerMessage = function({ endpoint, keys }, dataToSend) {
    return webpush.sendNotification({ endpoint, keys }, dataToSend, { TTL: 300})
      .then((result) => {
        console.log('Sent notification', result);
      })
      .catch((err) => {
        console.log('Error sending notification', err);
      });
    };
    
  return {
    triggerMessage,
  };
}
