import { checkBadWord } from "../services/CheckBadWord.js";
import { checkBeforeSupportWord } from "../services/CheckBeforeSupportWord.js";
import { checkAfterSupportWord } from "../services/CheckAfterSupportWord.js";

export const check = async (req, res) => {
  try {
    const words = req.body.words;
    const wordList = words.split(" ");

    const badWordsFound = await Promise.all(
      wordList.map(async (word) => await checkBadWord(word))
    );

    const foundBadWords = badWordsFound.filter((word) => word !== null);

    const sentimentScores = {
      "very negative": 3,
      negative: 2,
      neutral: 1,
      positive: 0,
    };

    if (foundBadWords.length > 0) {
      const issues = [];
      let totalScore = 0;

      for (let i = 0; i < foundBadWords.length; i++) {
        const badWord = foundBadWords[i];
        const badWordIndex = wordList.indexOf(badWord, i); // Menggunakan indexOf dengan posisi saat ini

        // Cek kata sebelumnya
        let previousWord = null;
        let isPreviousWordBad = null;
        let isPreviousWordSupportive = null;
        if (badWordIndex > 0) {
          previousWord = wordList[badWordIndex - 1];
          isPreviousWordSupportive = await checkBeforeSupportWord(previousWord);
          isPreviousWordBad = await checkBadWord(previousWord);
        }

        // Cek kata setelahnya
        let nextWord = null;
        let isNextWordBad = null;
        let isNextWordSupportive = null;
        if (badWordIndex < wordList.length - 1) {
          nextWord = wordList[badWordIndex + 1];
          isNextWordSupportive = await checkAfterSupportWord(nextWord);
          isNextWordBad = await checkBadWord(nextWord);
        }

        let issueSentiment = "neutral";
        if (isPreviousWordBad || isNextWordBad) {
          issueSentiment = "very negative";
        } else if (isPreviousWordSupportive || isNextWordSupportive) {
          issueSentiment = "negative";
        }

        issues.push({
          badWord: badWord,
          previousWord: previousWord,
          isPreviousWordBad: isPreviousWordBad,
          isPreviousWordSupportive: isPreviousWordSupportive,
          nextWord: nextWord,
          isNextWordBad: isNextWordBad,
          isNextWordSupportive: isNextWordSupportive,
          issueSentiment: issueSentiment,
        });

        totalScore += sentimentScores[issueSentiment];
      }

      let finalSentiment = "positive";
      if (totalScore >= 3) {
        finalSentiment = "very negative";
      } else if (totalScore >= 2) {
        finalSentiment = "negative";
      } else if (totalScore >= 1) {
        finalSentiment = "neutral";
      }

      return res.status(400).json({
        message: "Contains bad words",
        value: finalSentiment,
        issues: issues,
        data: words,
      });
    }

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
