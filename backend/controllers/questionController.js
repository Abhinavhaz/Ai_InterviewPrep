const Question = require("../models/Question")
const Session = require("../models/Session")





//Add qns to existing sessions
//post/api/question/add
const addQuestionsToSession = async (req, res) => {
try {
    const {sessionId,questions} = req.body

    if(!sessionId || !questions || !Array.isArray(questions)){
        return res.status(400).json({success:false,message:"Please provide all fields"})
    }

    const session = await Session.findById(sessionId)
    if(!session){
        return res.status(404).json({success:false,message:"Session not found"})
    }


//Create new questions
    const createdQuestions = await Question.insertMany(questions.map((q) => ({
        session:sessionId,
        question:q.question,
        answer:q.answer,
    })))
    //Update session to new  Id
    session.questions.push(...createdQuestions.map((q) => q._id))
    await session.save()
    res.status(201).json({createdQuestions})
} catch (error) {
    
}
}

//pin or Unpin a question 
//put/api/question/:id/pin

const togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
        if(!question){
            return res.status(404).json({success:false,message:"Question not found"})
        }
        question.isPinned = !question.isPinned
        await question.save()
        res.status(200).json({question})
        
    } catch (error) {
        res.status(500).json({message:"Internal Server Error togglePinQuestion",error:error.message})
    }
}

//update question note 
//put/api/question/:id/note

const updateQuestionNote = async (req, res) => {
    try {
        const {note} = req.body
        const question = await Question.findById(req.params.id)

        if(!question){
            return res.status(404).json({success:false,message:"Question not found"})
        }
        question.note = note || ""
        await question.save()

        res.status(200).json({question})
    } catch (error) {
     res.status(500).json({message:"Internal Server Error updateQuestionNote",error:error.message})  
    }
}

module.exports = {addQuestionsToSession,togglePinQuestion,updateQuestionNote}