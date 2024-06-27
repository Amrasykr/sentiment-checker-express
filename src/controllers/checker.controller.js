import BadWord from "../models/BadWord.js";
import { checkBadWord } from "../services/CheckBadWord.js";
import { checkBeforeSupportWord } from "../services/CheckBeforeSupportWord.js";
import { checkAfterSupportWord } from "../services/CheckAfterSupportWord.js";

export const check = async (req, res) => {
  try {
    const words = req.body.words;

    // Memisahkan kata-kata yang diberikan oleh pengguna
    const wordList = words.split(" ");

    // Loop melalui kata-kata dan cek apakah ada yang termasuk kata kasar
    const badWordsFound = await Promise.all(
      wordList.map(async (word) => {
        return await checkBadWord(word);
      })
    );

    // Filter out null values
    const foundBadWords = badWordsFound.filter((word) => word !== null);

    let value = "positive"; // Default value

    if (foundBadWords.length > 0) {
      // Variable untuk menentukan apakah ditemukan kata kasar yang very negative
      let foundVeryNegative = false;

      // Loop melalui kata kasar yang ditemukan untuk memeriksa kata sebelumnya dan setelahnya
      const issues = [];
      for (let i = 0; i < foundBadWords.length; i++) {
        const badWord = foundBadWords[i];
        const badWordIndex = wordList.indexOf(badWord);

        // Cek kata sebelumnya
        let previousWord = null;
        let isPreviousWordIsBad = null;
        let isPreviousWordIsSupport = null;
        if (badWordIndex > 0) {
          previousWord = wordList[badWordIndex - 1];
          isPreviousWordIsSupport = await checkBeforeSupportWord(previousWord);
          isPreviousWordIsBad = await checkBadWord(previousWord);
        }

        // Cek kata setelahnya
        let nextWord = null;
        let isNextWordIsBad = null;
        let isNextWordIsSupport = null;
        if (badWordIndex < wordList.length - 1) {
          nextWord = wordList[badWordIndex + 1];
          isNextWordIsSupport = await checkAfterSupportWord(nextWord);
          isNextWordIsBad = await checkBadWord(nextWord);
        }

        // Tentukan nilai berdasarkan hasil pemeriksaan
        if (
          (badWordIndex === 0 || badWordIndex === wordList.length - 1) &&
          (isPreviousWordIsBad || isNextWordIsBad)
        ) {
          foundVeryNegative = true;
        } else if (isPreviousWordIsBad && isNextWordIsBad) {
          foundVeryNegative = true;
        } else if (
          (isPreviousWordIsSupport || isNextWordIsSupport) &&
          !(isPreviousWordIsBad && isNextWordIsBad)
        ) {
          value = "negative";
        } else {
          // Jika tidak ditemukan kata kasar yang very negative, nilai tetap positif atau netral
          value = "neutral";
        }

        // Tambahkan informasi kata kasar dan kata pendukung sebelum dan sesudahnya ke dalam array issues
        issues.push({
          badWord: badWord,
          previousWord: previousWord,
          isPreviousWordIsBad: isPreviousWordIsBad,
          isPreviousWordIsSupport: isPreviousWordIsSupport,
          nextWord: nextWord,
          isNextWordIsBad: isNextWordIsBad,
          isNextWordIsSupport: isNextWordIsSupport,
        });
      }

      // Setelah loop, jika ditemukan kata kasar yang very negative, atur nilai value menjadi "very negative"
      if (foundVeryNegative) {
        value = "very negative";
      }

      return res.status(400).json({
        message: "Contains bad words",
        value: value,
        issues: issues,
        data: words,
      });
    }

    // Jika tidak ada kata kasar yang ditemukan, kembalikan nilai "positive"
    res.status(200).json({
      message: "Sentence contains no bad words",
      value: "positive",
      data: words,
    });
  } catch (error) {
    console.error("Error in check controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
