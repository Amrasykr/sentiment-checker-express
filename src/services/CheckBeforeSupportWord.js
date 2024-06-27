import BeforeSupportWord from "../models/BeforeSupportWord.js";
import BadWord from "../models/BadWord.js";

// Fungsi ini menerima kata dan memeriksa apakah kata tersebut termasuk kata pendukung sebelumnya dan kata kasar
export const checkBeforeSupportWord = async (word) => {
  try {
    const supportWords = await BeforeSupportWord.findAll({
      attributes: ["word"],
    });
    const supportWordList = supportWords.map((sw) => sw.word);

    const badWords = await BadWord.findAll({ attributes: ["bad"] });
    const badWordList = badWords.map((bw) => bw.bad);

    return supportWordList.includes(word) && !badWordList.includes(word)
      ? word
      : null;
  } catch (error) {
    console.error("Error checking before support word:", error);
    throw error;
  }
};
