import AfterSupportWord from "../models/AfterSupportWord.js";
import BadWord from "../models/BadWord.js";

// Fungsi ini menerima kata dan memeriksa apakah kata tersebut termasuk kata pendukung setelahnya dan kata kasar
export const checkAfterSupportWord = async (word) => {
  try {
    const supportWords = await AfterSupportWord.findAll({
      attributes: ["word"],
    });
    const supportWordList = supportWords.map((sw) => sw.word);

    const badWords = await BadWord.findAll({ attributes: ["word"] });
    const badWordList = badWords.map((bw) => bw.word);

    return supportWordList.includes(word) && !badWordList.includes(word)
      ? word
      : null;
  } catch (error) {
    console.error("Error checking after support word:", error);
    throw error;
  }
};
