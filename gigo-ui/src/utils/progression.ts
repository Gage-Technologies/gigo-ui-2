export default function DetermineProgressionLevel(progression_type: string, progression_value: string){
    switch(progression_type) {
     case "data_hog":
         const data_hog_level = parseFloat(progression_value || '0');
         if (data_hog_level < 10000) {
             return ["Level 1", "10000"];
         } else if (data_hog_level < 50000) {
             return ["Level 2", "50000"]; 
         } else if (data_hog_level < 100000) {
             return ["Level 3", "100000"];
         }else{
             return ["Level 3", "100000"];
         }
         
     case "hungry_learner":
        const hungry_learner_level = parseFloat(progression_value || '0');
        if (hungry_learner_level < 5) {
             return ["Level 1", "5"];
        }else if (hungry_learner_level < 10) {
             return ["Level 2", "10"];
        }else if (hungry_learner_level < 20) {
             return ["Level 3", "20"];
        }else{
             return ["Level 3", "20"];
        }
     case "man_of_the_inside":
        const manOnTheInside_level = parseFloat(progression_value || '0');
        if (manOnTheInside_level < 10) {
             return ["Level 1", "10"];
        }else if (manOnTheInside_level < 50) {
             return ["Level 2", "50"];
        }else if (manOnTheInside_level < 100) {
             return ["Level 3", "100"];
        }else{
             return ["Level 3", "100"];
        }
 
     case "scribe":
         const scribe_level = parseFloat(progression_value || '0');
         if (scribe_level < 50) {
             return ["Level 1", "50"];
         }else if (scribe_level < 100) {
             return ["Level 2", "100"];
         }else if (scribe_level < 250 ) {
             return ["Level 3", "250"];
         }else{
             return ["Level 3", "250"];
         }
     case "tenacious":
         const tenacious_level = parseFloat(progression_value || '0');
         if (tenacious_level < 5) {
             return ["Level 1", "5"];
         }else if (tenacious_level < 10) {
             return ["Level 2", "10"];
         }else if (tenacious_level < 15) {
             return ["Level 3", "15"];
         }else{
             return ["Level 3", "15"];
         }
     case "unit_mastery":
         const unit_mastery_level = parseFloat(progression_value || '0');
         if (unit_mastery_level < 1) {
             return ["Level 1", "1"];
         }else if (unit_mastery_level < 3) {
             return ["Level 2", "3"];
         }else if (unit_mastery_level < 5) {
             return ["Level 3", "5"];
         }else{
             return ["Level 3", "5"];
         }
    }
 }