export interface Exercise {
  id: string;
  name: string;
  muscleGroup:
    | "chest"
    | "back"
    | "shoulders"
    | "biceps"
    | "triceps"
    | "legs"
    | "glutes"
    | "core"
    | "cardio"
    | "full_body";
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: "none" | "dumbbells" | "full_gym";
  instructions: string;
  category: "compound" | "isolation" | "cardio";
}

export const exercises: Exercise[] = [
  // ── NO EQUIPMENT ──────────────────────────────────────────────
  {
    id: "pushup",
    name: "Push-Up",
    muscleGroup: "chest",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Start in plank position. Lower chest to floor keeping elbows at 45°. Push back up to start. Keep core tight throughout.",
    category: "compound",
  },
  {
    id: "wide_pushup",
    name: "Wide Push-Up",
    muscleGroup: "chest",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Hands wider than shoulder-width. Lower chest to ground. Push back up. Focuses more on outer chest.",
    category: "compound",
  },
  {
    id: "diamond_pushup",
    name: "Diamond Push-Up",
    muscleGroup: "triceps",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Form a diamond shape with your hands. Lower chest toward hands. Push back up. Intense tricep and inner chest activation.",
    category: "isolation",
  },
  {
    id: "pullup",
    name: "Pull-Up",
    muscleGroup: "back",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Hang from bar with overhand grip. Pull chest to bar engaging lats. Lower slowly. Full range of motion.",
    category: "compound",
  },
  {
    id: "chinup",
    name: "Chin-Up",
    muscleGroup: "biceps",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Hang from bar with underhand grip. Pull chin above bar. Lower slowly. Targets biceps more than pull-ups.",
    category: "compound",
  },
  {
    id: "bodyweight_squat",
    name: "Bodyweight Squat",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Feet shoulder-width apart. Lower until thighs are parallel to floor. Push through heels to stand. Keep chest up.",
    category: "compound",
  },
  {
    id: "jump_squat",
    name: "Jump Squat",
    muscleGroup: "legs",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Squat down then explosively jump. Land softly and immediately lower into next squat. High calorie burn.",
    category: "compound",
  },
  {
    id: "lunge",
    name: "Forward Lunge",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Step forward with one leg. Lower back knee toward floor. Push off front foot to return. Alternate legs.",
    category: "compound",
  },
  {
    id: "reverse_lunge",
    name: "Reverse Lunge",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Step backward with one leg. Lower back knee toward floor. Push through front heel to return. Easier on knees.",
    category: "compound",
  },
  {
    id: "glute_bridge",
    name: "Glute Bridge",
    muscleGroup: "glutes",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Lie on back, knees bent. Push hips up squeezing glutes. Hold for 1-2 seconds at top. Lower slowly.",
    category: "isolation",
  },
  {
    id: "single_leg_glute_bridge",
    name: "Single-Leg Glute Bridge",
    muscleGroup: "glutes",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Same as glute bridge but extend one leg. Push through heel of planted foot. Alternate sides.",
    category: "isolation",
  },
  {
    id: "plank",
    name: "Plank",
    muscleGroup: "core",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Forearms on ground, body in straight line. Hold position. Do not let hips sag or raise. Breathe steadily.",
    category: "isolation",
  },
  {
    id: "side_plank",
    name: "Side Plank",
    muscleGroup: "core",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Lie on side, one forearm on ground. Lift hips to form straight line. Hold. Great for obliques.",
    category: "isolation",
  },
  {
    id: "mountain_climber",
    name: "Mountain Climber",
    muscleGroup: "core",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Start in high plank. Drive knees alternately toward chest rapidly. Keep hips level. Excellent cardio + core.",
    category: "cardio",
  },
  {
    id: "burpee",
    name: "Burpee",
    muscleGroup: "full_body",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "From standing, squat down, jump feet back to plank, do push-up, jump feet in, jump up with arms overhead. Full body explosive.",
    category: "cardio",
  },
  {
    id: "bicycle_crunch",
    name: "Bicycle Crunch",
    muscleGroup: "core",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. Alternate in cycling motion.",
    category: "isolation",
  },
  {
    id: "leg_raise",
    name: "Leg Raise",
    muscleGroup: "core",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Lie flat. Keep legs straight, raise to 90°. Lower slowly without touching floor. Targets lower abs.",
    category: "isolation",
  },
  {
    id: "russian_twist",
    name: "Russian Twist",
    muscleGroup: "core",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Sit with knees bent, lean back slightly. Rotate torso side to side. For more challenge lift feet off floor.",
    category: "isolation",
  },
  {
    id: "superman",
    name: "Superman",
    muscleGroup: "back",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Lie face down, arms extended. Simultaneously lift arms and legs off ground. Hold briefly. Works lower back.",
    category: "isolation",
  },
  {
    id: "pike_pushup",
    name: "Pike Push-Up",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    equipment: "none",
    instructions:
      "Start in downward dog position. Bend elbows to lower head toward floor. Push back up. Great shoulder builder.",
    category: "compound",
  },
  {
    id: "tricep_dip",
    name: "Tricep Dip (Chair)",
    muscleGroup: "triceps",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Hands on chair edge behind you. Lower body by bending elbows. Push back up. Keep back close to chair.",
    category: "isolation",
  },
  {
    id: "jumping_jack",
    name: "Jumping Jack",
    muscleGroup: "cardio",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Jump feet apart while raising arms overhead. Jump back to start. Excellent warm-up and cardio exercise.",
    category: "cardio",
  },
  {
    id: "high_knee",
    name: "High Knees",
    muscleGroup: "cardio",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Run in place driving knees as high as possible. Pump arms in coordination. Keep core engaged.",
    category: "cardio",
  },
  {
    id: "wall_sit",
    name: "Wall Sit",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Back against wall, lower until thighs parallel to floor. Hold position. Burns quads intensely.",
    category: "isolation",
  },
  {
    id: "calf_raise_bw",
    name: "Calf Raise",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "none",
    instructions:
      "Stand on edge of step (or flat). Rise on toes as high as possible. Lower slowly. Works gastrocnemius.",
    category: "isolation",
  },
  // ── DUMBBELLS ──────────────────────────────────────────────────
  {
    id: "db_bench_press",
    name: "Dumbbell Bench Press",
    muscleGroup: "chest",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Lie on bench/floor, dumbbells at chest level. Press up until arms extended. Lower slowly. Full chest stretch.",
    category: "compound",
  },
  {
    id: "db_fly",
    name: "Dumbbell Fly",
    muscleGroup: "chest",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Lie on bench. Arms wide with slight elbow bend. Arc dumbbells up to meet at top. Stretch and squeeze chest.",
    category: "isolation",
  },
  {
    id: "db_row",
    name: "Dumbbell Row",
    muscleGroup: "back",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Hinge forward. Pull dumbbell to hip keeping elbow close. Lower slowly. Squeeze lats at top. Alternate sides.",
    category: "compound",
  },
  {
    id: "db_pullover",
    name: "Dumbbell Pullover",
    muscleGroup: "back",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Lie on bench. Hold dumbbell overhead with both hands. Arc over head behind you. Pull back to start. Works lats and chest.",
    category: "compound",
  },
  {
    id: "db_shoulder_press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Dumbbells at shoulder height. Press up until arms nearly extended. Lower to start. Keep core braced.",
    category: "compound",
  },
  {
    id: "db_lateral_raise",
    name: "Lateral Raise",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells at sides. Raise arms to shoulder height. Lower slowly. Targets medial deltoid. Slight elbow bend.",
    category: "isolation",
  },
  {
    id: "db_front_raise",
    name: "Front Raise",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells in front. Raise one or both to shoulder height. Lower slowly. Targets anterior deltoid.",
    category: "isolation",
  },
  {
    id: "db_bicep_curl",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "biceps",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells at sides. Curl up to shoulder keeping elbows still. Lower slowly. Squeeze at top.",
    category: "isolation",
  },
  {
    id: "db_hammer_curl",
    name: "Hammer Curl",
    muscleGroup: "biceps",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells with neutral (thumbs up) grip. Curl up maintaining grip. Targets brachialis and biceps.",
    category: "isolation",
  },
  {
    id: "db_tricep_ext",
    name: "Tricep Extension",
    muscleGroup: "triceps",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbell overhead with both hands. Lower behind head bending elbows. Press back up. Full range of motion.",
    category: "isolation",
  },
  {
    id: "db_tricep_kickback",
    name: "Tricep Kickback",
    muscleGroup: "triceps",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hinge forward, upper arm parallel to floor. Extend forearm back. Squeeze tricep fully. Return slowly.",
    category: "isolation",
  },
  {
    id: "goblet_squat",
    name: "Goblet Squat",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbell at chest. Feet shoulder-width. Lower into squat keeping chest up. Push through heels to stand.",
    category: "compound",
  },
  {
    id: "db_lunge",
    name: "Dumbbell Lunge",
    muscleGroup: "legs",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells at sides. Step forward into lunge. Alternate legs. Adds resistance to classic lunge.",
    category: "compound",
  },
  {
    id: "romanian_dl",
    name: "Romanian Deadlift",
    muscleGroup: "glutes",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells in front. Hinge at hips pushing them back. Lower dumbbells along legs. Squeeze glutes to stand.",
    category: "compound",
  },
  {
    id: "db_sumo_squat",
    name: "Sumo Squat",
    muscleGroup: "glutes",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Wide stance toes pointed out. Hold dumbbell between legs. Lower into squat. Targets inner thighs and glutes.",
    category: "compound",
  },
  {
    id: "db_step_up",
    name: "Dumbbell Step-Up",
    muscleGroup: "legs",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells at sides. Step onto bench or box. Drive through heel. Alternate legs. Great quad and glute builder.",
    category: "compound",
  },
  {
    id: "db_calf_raise",
    name: "Standing Calf Raise",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells at sides. Rise on toes. Lower slowly. Pause at top for maximum squeeze.",
    category: "isolation",
  },
  {
    id: "db_shrug",
    name: "Dumbbell Shrug",
    muscleGroup: "back",
    difficulty: "beginner",
    equipment: "dumbbells",
    instructions:
      "Hold dumbbells at sides. Elevate shoulders straight up. Hold briefly. Lower slowly. Works trapezius.",
    category: "isolation",
  },
  {
    id: "renegade_row",
    name: "Renegade Row",
    muscleGroup: "back",
    difficulty: "advanced",
    equipment: "dumbbells",
    instructions:
      "Start in push-up position with dumbbells. Row one dumbbell to hip while balancing. Alternate. Core stability challenge.",
    category: "compound",
  },
  {
    id: "db_arnold_press",
    name: "Arnold Press",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    equipment: "dumbbells",
    instructions:
      "Start with dumbbells at chest, palms facing you. Rotate palms outward as you press up. Reverse to lower. Hits all deltoid heads.",
    category: "compound",
  },
  // ── FULL GYM ───────────────────────────────────────────────────
  {
    id: "barbell_bench",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Lie on bench. Grip slightly wider than shoulder-width. Lower bar to chest. Press up powerfully. King of chest exercises.",
    category: "compound",
  },
  {
    id: "incline_bench",
    name: "Incline Barbell Press",
    muscleGroup: "chest",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Set bench to 30-45°. Press barbell from upper chest upward. Targets upper chest and anterior delts.",
    category: "compound",
  },
  {
    id: "cable_fly",
    name: "Cable Crossover",
    muscleGroup: "chest",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Stand between cables set high. Pull down and together crossing in front. Constant tension on chest throughout.",
    category: "isolation",
  },
  {
    id: "deadlift",
    name: "Deadlift",
    muscleGroup: "back",
    difficulty: "advanced",
    equipment: "full_gym",
    instructions:
      "Bar over mid-foot. Hinge to grip just outside legs. Brace core. Drive through floor to stand. Lower with control. King of all lifts.",
    category: "compound",
  },
  {
    id: "barbell_row",
    name: "Barbell Bent-Over Row",
    muscleGroup: "back",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Hinge to 45°. Grip bar. Pull to lower chest keeping elbows wide. Lower with control. Builds thick back.",
    category: "compound",
  },
  {
    id: "lat_pulldown",
    name: "Lat Pulldown",
    muscleGroup: "back",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Sit at cable machine. Pull bar to upper chest. Lean slightly back. Lower slowly under control. Builds lat width.",
    category: "compound",
  },
  {
    id: "cable_row",
    name: "Seated Cable Row",
    muscleGroup: "back",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Sit at cable row station. Pull handle to lower chest squeezing shoulder blades. Extend slowly. Mid-back focus.",
    category: "compound",
  },
  {
    id: "barbell_ohp",
    name: "Overhead Press",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Grip bar at shoulder-width. Press overhead until arms locked out. Lower to clavicle. Keep core tight. Builds boulder shoulders.",
    category: "compound",
  },
  {
    id: "upright_row",
    name: "Upright Row",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Grip bar narrow. Pull straight up to chin keeping elbows high. Lower slowly. Works delts and traps.",
    category: "compound",
  },
  {
    id: "barbell_curl",
    name: "Barbell Curl",
    muscleGroup: "biceps",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Stand with barbell at thighs. Curl to chest keeping elbows stationary. Lower slowly. Classic bicep builder.",
    category: "isolation",
  },
  {
    id: "preacher_curl",
    name: "Preacher Curl",
    muscleGroup: "biceps",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Rest upper arms on preacher pad. Curl fully up. Lower slowly through full range. Isolates biceps completely.",
    category: "isolation",
  },
  {
    id: "cable_tricep_pushdown",
    name: "Tricep Pushdown",
    muscleGroup: "triceps",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Stand at cable machine. Push rope or bar down until arms extended. Control the return. Excellent tricep isolation.",
    category: "isolation",
  },
  {
    id: "skull_crusher",
    name: "Skull Crusher",
    muscleGroup: "triceps",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Lie on bench, bar above face. Bend elbows to lower toward forehead. Extend back up. Keep upper arms vertical.",
    category: "isolation",
  },
  {
    id: "barbell_squat",
    name: "Barbell Back Squat",
    muscleGroup: "legs",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Bar on upper traps. Feet shoulder-width. Lower until thighs parallel. Drive up powerfully. The king of leg exercises.",
    category: "compound",
  },
  {
    id: "front_squat",
    name: "Front Squat",
    muscleGroup: "legs",
    difficulty: "advanced",
    equipment: "full_gym",
    instructions:
      "Bar on front delts. Elbows high. Squat deep maintaining upright torso. Greater quad activation than back squat.",
    category: "compound",
  },
  {
    id: "leg_press",
    name: "Leg Press",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Sit in leg press machine. Push platform away. Lower slowly to 90°. Keep lower back on pad. Safer alternative to squat.",
    category: "compound",
  },
  {
    id: "leg_curl",
    name: "Leg Curl",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Lie face down on machine. Curl legs toward glutes. Lower slowly. Isolates hamstrings completely.",
    category: "isolation",
  },
  {
    id: "leg_extension",
    name: "Leg Extension",
    muscleGroup: "legs",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Sit on machine. Extend legs to straight. Lower slowly. Isolates quadriceps. Great finishing movement.",
    category: "isolation",
  },
  {
    id: "hip_thrust_barbell",
    name: "Barbell Hip Thrust",
    muscleGroup: "glutes",
    difficulty: "intermediate",
    equipment: "full_gym",
    instructions:
      "Shoulders on bench, bar on hips. Drive hips up squeezing glutes hard. Lower slowly. Best glute builder.",
    category: "compound",
  },
  {
    id: "cable_kickback",
    name: "Cable Kickback",
    muscleGroup: "glutes",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Attach ankle strap to cable. Kick leg back and up squeezing glute. Return slowly. Isolates glute max.",
    category: "isolation",
  },
  {
    id: "cable_crunch",
    name: "Cable Crunch",
    muscleGroup: "core",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Kneel at cable. Rope behind head. Crunch down touching elbows to knees. Return slowly. Weighted abs work.",
    category: "isolation",
  },
  {
    id: "running",
    name: "Treadmill Run",
    muscleGroup: "cardio",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Run at moderate pace on treadmill. Maintain upright posture. Land mid-foot. Great cardiovascular training.",
    category: "cardio",
  },
  {
    id: "rowing_machine",
    name: "Rowing Machine",
    muscleGroup: "cardio",
    difficulty: "beginner",
    equipment: "full_gym",
    instructions:
      "Pull handle to chest driving with legs first then back then arms. Full body cardio. Excellent for endurance.",
    category: "cardio",
  },
];

export default exercises;
