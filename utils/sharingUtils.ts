export function shareOnX(text: string) {
  const encodedText = encodeURIComponent(text);
  window.open(
    `https://twitter.com/intent/post?text=${encodedText}`,
    'newwindow',
    'width=600,height=400'
  );
}
