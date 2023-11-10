import { type Response } from "express";
import { type UidRequest } from "../interface/user";
import { type ApiResponse } from "../interface/response";
import { type InputChatGPT, type GPTObjectType, QuizObjectType, QuizInsertObjectType } from "../interface/quiz";
import { parsingData } from "../openAi/parsing";
import { insertQuiz } from "../Quiz/QuizService";
import { admin } from "../auth/firebase";
import { chatGPT } from "../openAi/openAi";

export const postQuiz = async (req: UidRequest, res: Response): Promise<void> => {
    try {
        if (typeof req.uid === 'string'){
            const uid: string = req.uid;
            const userInfo = await admin.auth().getUser(uid);
            if (userInfo === undefined) {
              const resData: ApiResponse = {
                ok: false,
                msg: '파이어베이스에 등록되지 않은 유저입니다.'
              };
              res.status(410).json(resData);
              return;
            }
            
            const passedData: InputChatGPT = {
                userInput: req.body.quizRawScript,
                category: req.body.category
            }

            const processedData: string = await chatGPT(passedData);

            const object: GPTObjectType = await parsingData(processedData);

            const response: ApiResponse = {
                ok: true,
                msg: "Successfully POST Quiz About Project",
                data: object
            }

            if (object.quiz !== null){

                const quizArray: QuizInsertObjectType[] = []
                for (const quiz of object.quiz){
                    if (typeof quiz.quizQuestion === 'string' && typeof quiz.quizAnswer === 'string' && typeof quiz.quizComment === 'string'){
                        const item: QuizInsertObjectType = {
                            projectId: req.body.projectId,
                            quizQuestion: quiz.quizQuestion,
                            quizAnswer: quiz.quizAnswer,
                            quizComment: quiz.quizComment
                        }
                        quizArray.push(item);
                    }
                }
                await insertQuiz(quizArray);
            }

            res.status(200).json(response);

        }
    }
    catch (err) {
        console.log(err);
        const response: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).send(response);
        throw err;
    }
}