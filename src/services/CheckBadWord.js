import BadWord from "../models/BadWord.js";

// Fungsi ini menerima kata dan memeriksa apakah kata tersebut termasuk kata kasar
export const checkBadWord = async (word) => {
  try {
    const badWords = await BadWord.findAll({ attributes: ["word"] });
    const badWordList = badWords.map((bw) => bw.word);
    return badWordList.includes(word) ? word : null;
  } catch (error) {
    console.error("Error checking bad word:", error);
    throw error;
  }
};
