import Learning from "../models/Learning.js";
import { checkBadWord } from "./CheckBadWord.js";
import { checkBeforeSupportWord } from "./CheckBeforeSupportWord.js";
import { checkAfterSupportWord } from "./CheckAfterSupportWord.js";

export const findLearning = async (before, bad, after) => {
  try {
    const record = await Learning.findOne({
      where: {
        before: before,
        badword: bad,
        after: after,
      },
    });

    const isPreviousWordSupportive = await checkBeforeSupportWord(before);
    const isNextWordSupportive = await checkAfterSupportWord(after);
    const isPreviousWordBad = await checkBadWord(before);
    const isNextWordBad = await checkBadWord(after);

    if (record) {
      return {
        badWord: bad,
        previousWord: before,
        nextWord: after,
        issueSentiment: record.type,
        isPreviousWordSupportive: isPreviousWordSupportive,
        isNextWordSupportive: isNextWordSupportive,
        isPreviousWordBad: isPreviousWordBad,
        isNextWordBad: isNextWordBad,
        foundInLearning: true,
      };
    }
  } catch (error) {
    console.error("Error finding learning record:", error);
    throw error;
  }
};

export const createLearning = async ({ before, badword, after, type, narrative }) => {
  try {
    const existingRecord = await Learning.findOne({
      where: {
        before: before,
        badword: badword,
        after: after,
      },
    });

    if (!existingRecord) {
      const newRecord = await Learning.create({
        before: before,
        badword: badword,
        after: after,
        type: type,
        narrative: narrative,
      });
      return newRecord;
    } else {
      console.log("Record already exists, not creating a duplicate.");
    }
  } catch (error) {
    console.error("Error creating learning record:", error);
    throw error;
  }
};
