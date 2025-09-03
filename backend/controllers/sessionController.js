const Session = require("../models/Session");
const Question = require("../models/Question");

// Create a new session and linked questions
//post/api/session/create

const createSession = async (req, res) => {
    try {
        const { role, experience, questions, description, topicsToFocus } = req.body;
        const userId = req.user.id;
        const session = await Session.create({
            user: userId,
            role,
            experience,
            description,
            topicsToFocus
        });
        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,

                })
                return question._id;
            })
        )
        session.questions = questionDocs;
        await session.save();
        res.status(201).json({ success: true, session });

    } catch (error) {
        res.status(500).json({ message: "SOmething is wrong", error: error.message })
    }
}


const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        .populate({path :"questions",
options :{sort :{isPinned : -1,createdAt : -1}}
    })
    .exec()
       
    if(!session){
            return res.status(404).json({success :false,message:"Session not found"})
        }
        res.status(200).json({success:true,session})
        
    } catch (error) {
        res.status(500).json({message:"something went wrong2",error:error.message})
    }
}



const getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({user:req.user._id})
        .sort({createdAt : -1})
        .populate("questions")
        res.status(200).json({success:true,sessions})
        console.log("req.user in getMySessions:", req.user);
    } catch (error) {
        res.status(500).json({message:"Something is wrong3",error:error.message})
    }
}


const deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id)
        if(!session){
            return res.status(404).json({success :false,message:"Session not found"})
        }
   if(session.user.toString() !== req.user.id){
            return res.status(401).json({success :false,message:"Unauthorized"})
        }

        await Question.deleteMany({session: session._id})
        await  session.deleteOne()
        res.status(200).json({success:true,message:"Session deleted"})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error deleteSession",error:error.message})
    }
}


module.exports = { createSession, getSessionById, getMySessions, deleteSession };
