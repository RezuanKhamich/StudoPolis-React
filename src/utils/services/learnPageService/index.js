import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase";

export const setEmptyPageCells = (data) => {
  let resultPageArray = [];
  for(let section in data){
    resultPageArray[section] = []
    for(let page = 0; page < data[section].pageCount; page++){
      resultPageArray[section][page] = ''
    }
  }
  return resultPageArray
}

export const setDoneSectionCells = (data) => {
  let resultSectionArray = []
  console.log(data)
  if(data.length){
    data.map((section, index) => {
      resultSectionArray[index] = !section.includes('0')
    })
  }

  return resultSectionArray
}

export const updateLectureProgress = async (isUserAuthorized, courseId, moduleId, lectureId, pageCompletedId, courseData, setCourseData) => {
  const lectureDocRef = doc(db, "courses", isUserAuthorized.uid);

  let currentPageProgress = courseData[`course_${courseId}`][`modules`][`module_${moduleId}`][`lectures`][`lecture_${lectureId}`].pageProgress.split('')
  currentPageProgress[pageCompletedId] = '1'
  let resultPageProgress = currentPageProgress.join('')

  await updateDoc(lectureDocRef, {
    [`course_${courseId}.modules.module_${moduleId}.lectures.lecture_${lectureId}.pageProgress`]: `${resultPageProgress}`,
  });

  const courseDataNew = await getDoc(lectureDocRef);
  if (courseDataNew.exists()) {
    setCourseData(courseDataNew.data())
  } else {
    console.log("No such document!");
  }
}

export const updateQuizProgress = async (isUserAuthorized, userAnswers, courseId, moduleId, lectureId, pageCompletedId, courseData, setCourseData) => {
  const lectureDocRef = doc(db, "courses", isUserAuthorized.uid);

  let currentQuizProgress = courseData[`course_${courseId}`][`modules`][`module_${moduleId}`][`lectures`][`lecture_${lectureId}`].quizProgress.split('')
  userAnswers.forEach((elem, index) => {
    currentQuizProgress[index] = elem
  })
  console.log(currentQuizProgress)
  let resultPageProgress = currentQuizProgress.join('')

  await updateDoc(lectureDocRef, {
    [`course_${courseId}.modules.module_${moduleId}.lectures.lecture_${lectureId}.quizProgress`]: `${resultPageProgress}`,
  });

  const courseDataNew = await getDoc(lectureDocRef);
  if (courseDataNew.exists()) {
    setCourseData(courseDataNew.data())
  } else {
    console.log("No such document!");
  }
}