import { checkBadWord } from "../services/CheckBadWord.js";
import { checkBeforeSupportWord } from "../services/CheckBeforeSupportWord.js";
import { checkAfterSupportWord } from "../services/CheckAfterSupportWord.js";
import { findLearning, createLearning } from "../services/Learning.js";
import { sentimentScores } from "../utils/sentiment_score.js";

export const check = async (req, res) => {
  try {
    const words = req.body.words;
    const wordList = words.split(" ");

    // Mencari kata-kata buruk dalam kalimat yang diberikan
    const badWordsFound = await Promise.all(
      wordList.map(async (word) => await checkBadWord(word))
    );

    // Memfilter hanya kata-kata buruk yang ditemukan
    const foundBadWords = badWordsFound.filter((word) => word !== null);

    if (foundBadWords.length > 0) {
      const issues = [];
      let totalScore = 0;

      for (let i = 0; i < foundBadWords.length; i++) {
        const badWord = foundBadWords[i];
        const badWordIndex = wordList.indexOf(badWord, i); // Menggunakan indexOf dengan posisi saat ini

        // Cek kata sebelumnya
        let previousWord = null;
        if (badWordIndex > 0) {
          previousWord = wordList[badWordIndex - 1];
        }

        // Cek kata setelahnya
        let nextWord = null;
        if (badWordIndex < wordList.length - 1) {
          nextWord = wordList[badWordIndex + 1];
        }

        // Cek di tabel Learning untuk mendapatkan riwayat pembelajaran terkait
        let learningRecord = await findLearning(
          previousWord,
          badWord,
          nextWord
        );
        let issueSentiment = "neutral";
        let isPreviousWordSupportive = null;
        let isNextWordSupportive = null;
        let isPreviousWordBad = null;
        let isNextWordBad = null;

        if (learningRecord) {
          issueSentiment = learningRecord.issueSentiment;
          issues.push({
            badWord: learningRecord.badWord,
            previousWord: learningRecord.previousWord,
            nextWord: learningRecord.nextWord,
            issueSentiment: learningRecord.issueSentiment,
            isPreviousWordSupportive: learningRecord.isPreviousWordSupportive,
            isNextWordSupportive: learningRecord.isNextWordSupportive,
            isPreviousWordBad: learningRecord.isPreviousWordBad,
            isNextWordBad: learningRecord.isNextWordBad,
            isLearningRecord: true,
          });
        } else {
          // Jika tidak ada riwayat pembelajaran, tentukan sentimen berdasarkan kata sebelum dan sesudah
          isPreviousWordSupportive = await checkBeforeSupportWord(previousWord);
          isNextWordSupportive = await checkAfterSupportWord(nextWord);
          isPreviousWordBad = await checkBadWord(previousWord);
          isNextWordBad = await checkBadWord(nextWord);

          if (isPreviousWordBad || isNextWordBad) {
            issueSentiment = "very negative";
          } else if (isPreviousWordSupportive || isNextWordSupportive) {
            issueSentiment = "negative";
          }

          issues.push({
            badWord: badWord,
            previousWord: previousWord,
            nextWord: nextWord,
            issueSentiment: issueSentiment,
            isPreviousWordSupportive: isPreviousWordSupportive,
            isNextWordSupportive: isNextWordSupportive,
            isPreviousWordBad: isPreviousWordBad,
            isNextWordBad: isNextWordBad,
          });
        }

        totalScore += sentimentScores[issueSentiment];
      }

      // Tentukan sentimen akhir berdasarkan total skor
      let finalSentiment = "positive";
      if (totalScore >= 3) {
        finalSentiment = "very negative";
      } else if (totalScore >= 2) {
        finalSentiment = "negative";
      } else if (totalScore >= 1) {
        finalSentiment = "neutral";
      }

      // Filter masalah yang belum dipelajari atau memiliki sentimen negatif
      const issuesToLearn = issues.filter((issue) => {
        if (!issue.learningRecord) {
          return true; // Tambahkan jika tidak ada riwayat pembelajaran
        } else {
          return issue.learningRecord.issueSentiment !== "positive";
        }
      });

      // Jika ada masalah yang memenuhi syarat, tambahkan ke pembelajaran baru
      if (issuesToLearn.length > 0) {
        for (const issue of issuesToLearn) {
          await createLearning({
            before: issue.previousWord,
            badword: issue.badWord,
            after: issue.nextWord,
            type: issue.issueSentiment,
            narrative: words,
          });
        }
      }

      // Kirim respons JSON dengan hasil analisis sentimen
      return res.status(200).json({
        message: "Found bad words",
        sentiment_score: totalScore,
        value: finalSentiment,
        issues: issues,
        data: words,
      });
    }

    // Kirim respons JSON jika tidak ada kata buruk yang ditemukan
    res.status(200).json({
      message: "Bad words not found",
      value: "positive",
      data: words,
    });
  } catch (error) {
    // Tangani kesalahan jika terjadi
    console.error("Error in check controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
