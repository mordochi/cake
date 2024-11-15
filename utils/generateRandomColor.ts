/**
 * Color list
 * @see https://www.figma.com/design/zNhbCeUmV3s5qBKtHY0l9l/0.-Assets-Design-System?node-id=2405-3129&t=M5iMvuzyqq6RoIcC-1
 */
export const colorList = [
  '#E2F3FF',
  '#BAE0FF',
  '#8BCEFF',
  '#53BAFF',
  '#14AAFF',
  '#009AFF',
  '#008BFF',
  '#0075FF',
  '#1564EC',
  '#2242CD',
  '#EAECFD',
  '#C9CEF9',
  '#A3AFF6',
  '#7B8FF2',
  '#5A74EF',
  '#365BEA',
  '#3051DE',
  '#2446D2',
  '#183BC6',
  '#0025B4',
  '#E8F4FD',
  '#C6E4FB',
  '#A5D4F9',
  '#83C4F8',
  '#68B6F9',
  '#53AAFB',
  '#4C9BEC',
  '#4489D9',
  '#3C78C8',
  '#2F59AA',
  '#E7F9FF',
  '#C1F0FF',
  '#98E6FF',
  '#6FDCFF',
  '#52D3FF',
  '#40CBFF',
  '#3ABBFC',
  '#32A7E7',
  '#2D95D4',
  '#2174B3',
  '#E8FDFC',
  '#C5FAF7',
  '#A0F8F5',
  '#80F4F2',
  '#6DF0EF',
  '#64EBEF',
  '#5FD9DC',
  '#58C2C1',
  '#51ADAA',
  '#45877F',
  '#F2FFF5',
  '#E0FFE7',
  '#C4FDD2',
  '#ADFDBF',
  '#9DFEB3',
  '#8BFBA3',
  '#83EB99',
  '#76D68A',
  '#6CC47E',
  '#5AA168',
  '#FFF8E0',
  '#FFECB0',
  '#FFE07C',
  '#FFD544',
  '#FFC90A',
  '#FFC100',
  '#FFB200',
  '#FF9F00',
  '#FF8D00',
  '#FF6B00',
  '#FFECEF',
  '#FFCFD5',
  '#F99D9E',
  '#F37678',
  '#FF5555',
  '#FF4239',
  '#F7393A',
  '#E42E33',
  '#D7262C',
  '#C8191F',
  '#F9F9F9',
  '#E4E8ED',
  '#BAC6D5',
  '#8FA1B8',
  '#657E9C',
  '#436389',
  '#194B79',
  '#114471',
  '#053B66',
  '#00325A',
  '#F8FBFF',
  '#F3F6FA',
  '#EEF1F5',
  '#E1E4E8',
  '#BFC2C6',
  '#A0A3A7',
  '#777A7D',
  '#636669',
  '#444649',
  '#232528',
];

const getColorDistance = (color1: string, color2: string) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
};

/**
 * Generate unique deterministic colors based on input strings, maintaining color dissimilarity
 * @param inputs - array of strings to generate colors for
 * @param excludeColors - colors to exclude
 * @returns colors(hex)
 */
export const generateColors = (
  inputs: string[],
  excludeColors: string[] = []
): string[] => {
  const filteredColors = colorList.filter(
    (color) => !excludeColors.includes(color)
  );

  const deterministicShuffle = (arr: string[], seed: string) => {
    const shuffled = [...arr];
    const seededRandom = (i: number) => {
      const x = Math.sin(seed.charCodeAt(i % seed.length) + i) * 10000;
      return x - Math.floor(x);
    };
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffled = deterministicShuffle(filteredColors, inputs.join(''));

  const getColorForString = (input: string): string => {
    const hash = input.split('').reduce((acc, char) => {
      const chr = char.charCodeAt(0);
      return ((acc << 5) - acc + chr) | 0;
    }, 0);
    const index = Math.abs(hash) % shuffled.length;

    if (shuffled.length <= inputs.length) {
      return shuffled[index];
    }

    let bestColor = shuffled[index];
    let maxMinDistance = 0;

    for (let i = 0; i < shuffled.length; i++) {
      const color = shuffled[(index + i) % shuffled.length];
      if (result.includes(color)) continue;

      let minDistance = Infinity;
      for (const usedColor of result) {
        const distance = getColorDistance(color, usedColor);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      if (minDistance > maxMinDistance) {
        maxMinDistance = minDistance;
        bestColor = color;
      }
    }

    return bestColor;
  };

  const result: string[] = [];
  for (const input of inputs) {
    result.push(getColorForString(input));
  }

  return result;
};
