const measureTextWidth = (textElement: HTMLElement, font: string): number => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let text;
  if (ctx) {
    ctx.font = font;
    text = ctx.measureText(textElement.innerHTML);
  }
  return text ? text.width : 0;
};

export default measureTextWidth;
