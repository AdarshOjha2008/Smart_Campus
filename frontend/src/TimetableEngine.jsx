import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronDown, Beaker } from 'lucide-react';

const ROOM_MAPPING = {
  CSE: 'Room No 138',
  DSAI: 'Room No 135',
  ECE: 'Room No 122',
  MTech_CSE: 'Room No 308',
  MTech_DSAI: 'Room No 319',
  MTech_ECE: 'Room No 320',
};

const TIMETABLE_DATA = {
  // ── B.Tech I Semester CSE (Room No 138) ──────────────────────────────────
  CSE: {
    Monday: [
      { time: '9:00-9:55', subject: 'Music', slot: 'Music', faculty: 'Dr. Darash', isLab: false },
      { time: '10:00-10:55', subject: 'Music', slot: 'Music', faculty: 'Dr. Darash', isLab: false },
      { time: '11:00-11:55', subject: 'Digital Electronics using Verilog', slot: 'L', faculty: 'Dr. Manoj', isLab: false },
      { time: '12:00-12:55', subject: 'Programming with C', slot: 'B', faculty: 'Dr. Ruhul', isLab: false },
      { time: '14:00-14:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '15:00-15:55', subject: 'Calculus', slot: 'Z', faculty: 'Dr. P P Paltani', isLab: false },
      { time: '16:00-17:55', subject: 'ILC / Yoga Practicals', slot: 'ILC/Yoga', faculty: 'Dr. Aruna / GF', isLab: false }
    ],
    Tuesday: [
      { time: '9:00-9:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'A', faculty: 'Dr. Mithilesh', isLab: false },
      { time: '10:00-10:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'A', faculty: 'Dr. Mithilesh', isLab: false },
      { time: '11:00-11:55', subject: 'IT Workshop', slot: 'P', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '12:00-12:55', subject: 'Programming with C', slot: 'B', faculty: 'Dr. Ruhul', isLab: false },
      { time: '14:00-15:55', subject: 'Internet of Things', slot: 'F', faculty: 'Dr. Abhishek', isLab: false },
      { time: '16:00-17:55', subject: 'Entrepreneurship', slot: 'E', faculty: 'Dr. Amit', isLab: false }
    ],
    Wednesday: [
      { time: '9:00-9:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '10:00-10:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'A', faculty: 'Dr. Mithilesh', isLab: false },
      { time: '11:00-12:55', subject: 'Calculus', slot: 'Z', faculty: 'Dr. P P Paltani', isLab: false },
      { time: '14:00-15:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '16:00-17:55', subject: 'Music Practicals', slot: 'Music', faculty: 'Dr. Darash', isLab: false }
    ],
    Thursday: [
      { time: '10:00-10:55', subject: 'Calculus', slot: 'Z', faculty: 'Dr. P P Paltani', isLab: false },
      { time: '11:00-11:55', subject: 'Digital Electronics using Verilog', slot: 'L', faculty: 'Dr. Manoj', isLab: false },
      { time: '12:00-12:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '14:00-15:55', subject: 'Digital Electronics using Verilog', slot: 'L', faculty: 'Dr. Manoj', isLab: false },
      { time: '16:00-16:55', subject: 'Internet of Things', slot: 'F', faculty: 'Dr. Abhishek', isLab: false },
      { time: '17:00-17:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'A', faculty: 'Dr. Mithilesh', isLab: false }
    ],
    Friday: [
      { time: '9:00-10:55', subject: 'Programming with C', slot: 'B', faculty: 'Dr. Ruhul', isLab: false },
      { time: '11:00-12:55', subject: 'IT Workshop', slot: 'P', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '14:00-15:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '16:00-17:55', subject: 'Yoga Session', slot: 'Yoga', faculty: 'GF', isLab: false }
    ]
  },

  // ── B.Tech I Semester DSAI (Room No 135 - from Separate 3rd PDF) ─────────
  DSAI: {
    Monday: [
      { time: '9:00-9:55', subject: 'Music', slot: 'Music', faculty: 'Dr. Darash', isLab: false },
      { time: '10:00-10:55', subject: 'Music', slot: 'Music', faculty: 'Dr. Darash', isLab: false },
      { time: '11:00-11:55', subject: 'Internet of Things', slot: 'C', faculty: 'Dr. Shubhangi', isLab: false },
      { time: '12:00-12:55', subject: 'Internet of Things', slot: 'C', faculty: 'Dr. Shubhangi', isLab: false },
      { time: '14:00-14:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '15:00-15:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'F', faculty: 'Dr. Ramakrishna', isLab: false },
      { time: '16:00-17:55', subject: 'ILC / Yoga Practicals', slot: 'ILC/Yoga', faculty: 'Dr. Aruna / Guest faculty', isLab: false }
    ],
    Tuesday: [
      { time: '9:00-9:55', subject: 'Programming with C', slot: 'M', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '10:00-10:55', subject: 'Entrepreneurship', slot: 'A', faculty: 'Dr. Amit', isLab: false },
      { time: '11:00-11:55', subject: 'Entrepreneurship', slot: 'A', faculty: 'Dr. Amit', isLab: false },
      { time: '14:00-15:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'F', faculty: 'Dr. Ramakrishna', isLab: false },
      { time: '16:00-17:55', subject: 'Digital Electronics using Verilog', slot: 'B', faculty: 'Dr. Lakhindar', isLab: false }
    ],
    Wednesday: [
      { time: '9:00-9:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '10:00-10:55', subject: 'IT Workshop', slot: 'G', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '11:00-11:55', subject: 'Digital Electronics using Verilog', slot: 'B', faculty: 'Dr. Lakhindar', isLab: false },
      { time: '12:00-12:55', subject: 'Calculus', slot: 'N', faculty: 'Dr. Mithilesh', isLab: false },
      { time: '14:00-15:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '16:00-17:55', subject: 'Music Practicals', slot: 'Music', faculty: 'Dr. Darash', isLab: false }
    ],
    Thursday: [
      { time: '9:00-9:55', subject: 'IT Workshop', slot: 'G', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '10:00-10:55', subject: 'IT Workshop', slot: 'G', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '11:00-11:55', subject: 'Programming with C', slot: 'M', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '12:00-12:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '14:00-15:55', subject: 'Programming with C', slot: 'M', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '16:00-16:55', subject: 'Calculus', slot: 'N', faculty: 'Dr. Mithilesh', isLab: false },
      { time: '17:00-17:55', subject: 'Digital Electronics using Verilog', slot: 'B', faculty: 'Dr. Lakhindar', isLab: false }
    ],
    Friday: [
      { time: '9:00-10:55', subject: 'Calculus', slot: 'N', faculty: 'Dr. Mithilesh', isLab: false },
      { time: '11:00-11:55', subject: 'Internet of Things', slot: 'C', faculty: 'Dr. Shubhangi', isLab: false },
      { time: '12:00-12:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'F', faculty: 'Dr. Ramakrishna', isLab: false },
      { time: '14:00-15:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '16:00-17:55', subject: 'Yoga Session', slot: 'Yoga', faculty: 'Guest faculty', isLab: false }
    ]
  },

  // ── B.Tech I Semester ECE (Room No 122) ──────────────────────────────────
  ECE: {
    Monday: [
      { time: '9:00-10:55', subject: 'Music', slot: 'Music', faculty: 'Dr. Darash', isLab: false },
      { time: '11:00-11:55', subject: 'IT Workshop', slot: 'H', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '12:00-12:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'V', faculty: 'Dr. Ramakrishna', isLab: false },
      { time: '14:00-14:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '15:00-15:55', subject: 'Programming with C', slot: 'A', faculty: 'Dr. M K Rao', isLab: false },
      { time: '16:00-17:55', subject: 'ILC / Yoga Practicals', slot: 'ILC/Yoga', faculty: 'Dr. Aruna / GF', isLab: false }
    ],
    Tuesday: [
      { time: '9:00-10:55', subject: 'Programming with C', slot: 'A', faculty: 'Dr. M K Rao', isLab: false },
      { time: '11:00-11:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'V', faculty: 'Dr. Ramakrishna', isLab: false },
      { time: '12:00-12:55', subject: 'Internet of Things', slot: 'C', faculty: 'Dr. Lakhindar', isLab: false },
      { time: '14:00-15:55', subject: 'IT Workshop', slot: 'H', faculty: 'Prof. Srinivasa', isLab: false },
      { time: '16:00-17:55', subject: 'Calculus', slot: 'B', faculty: 'Dr. P P Paltani', isLab: false }
    ],
    Wednesday: [
      { time: '9:00-9:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '10:00-10:55', subject: 'Digital Electronics using Verilog', slot: 'G', faculty: 'Dr. Maifuz', isLab: false },
      { time: '11:00-12:55', subject: 'Entrepreneurship', slot: 'D', faculty: 'Dr. Amit', isLab: false },
      { time: '14:00-15:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '16:00-17:55', subject: 'Music Practicals', slot: 'Music', faculty: 'Dr. Darash', isLab: false }
    ],
    Thursday: [
      { time: '9:00-10:55', subject: 'Digital Electronics using Verilog', slot: 'G', faculty: 'Dr. Maifuz', isLab: false },
      { time: '11:00-11:55', subject: 'Programming with C', slot: 'A', faculty: 'Dr. M K Rao', isLab: false },
      { time: '12:00-12:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '14:00-14:55', subject: 'Calculus', slot: 'B', faculty: 'Dr. P P Paltani', isLab: false },
      { time: '15:00-16:55', subject: 'Linear Algebra & Matrix Analysis', slot: 'V', faculty: 'Dr. Ramakrishna', isLab: false },
      { time: '17:00-17:55', subject: 'Digital Electronics using Verilog', slot: 'G', faculty: 'Dr. Maifuz', isLab: false }
    ],
    Friday: [
      { time: '10:00-10:55', subject: 'Calculus', slot: 'B', faculty: 'Dr. P P Paltani', isLab: false },
      { time: '11:00-12:55', subject: 'Internet of Things', slot: 'C', faculty: 'Dr. Lakhindar', isLab: false },
      { time: '14:00-15:55', subject: 'International Language Competency (ILC)', slot: 'ILC', faculty: 'Dr. Aruna', isLab: false },
      { time: '16:00-17:55', subject: 'Yoga Session', slot: 'Yoga', faculty: 'GF', isLab: false }
    ]
  },

  // ── M.Tech I Semester CSE (Room No 308) ──────────────────────────────────
  MTech_CSE: {
    Monday: [
      { time: '9:00-10:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '11:00-12:55', subject: 'Data Visualisation Analysis', slot: 'C', faculty: 'Dr MK Rao', isLab: false },
      { time: '14:00-14:55', subject: 'Mathematics for Machine Learning', slot: 'B', faculty: 'Dr Nishad', isLab: false },
      { time: '15:00-15:55', subject: 'Cyber Security Fundamentals', slot: 'A', faculty: 'Dr Satya', isLab: false },
      { time: '16:00-16:55', subject: 'Foundation of Data Science', slot: 'E', faculty: 'Dr Anurag', isLab: false }
    ],
    Tuesday: [
      { time: '10:00-10:55', subject: 'Cyber Security Fundamentals', slot: 'A', faculty: 'Dr Satya', isLab: false },
      { time: '11:00-12:55', subject: 'Personality Development and Life Skills', slot: 'D', faculty: 'Dr Sresha', isLab: false },
      { time: '14:00-15:55', subject: 'Digital Transformation-I', slot: 'Y', faculty: 'Guest faculty', isLab: false },
      { time: '16:00-17:55', subject: 'Mathematics for Machine Learning', slot: 'B', faculty: 'Dr Nishad', isLab: false }
    ],
    Wednesday: [
      { time: '9:00-9:55', subject: 'Foundation of Data Science', slot: 'E', faculty: 'Dr Anurag', isLab: false },
      { time: '10:00-11:55', subject: 'Generative AI and Prompt Engineering', slot: 'K', faculty: 'Mr Atram', isLab: false },
      { time: '12:00-12:55', subject: 'Data Visualisation Analysis', slot: 'C', faculty: 'Dr MK Rao', isLab: false }
    ],
    Thursday: [
      { time: '9:00-10:55', subject: 'Foundation of Data Science', slot: 'E', faculty: 'Dr Anurag', isLab: false },
      { time: '11:00-12:55', subject: 'Cyber Security Fundamentals', slot: 'A', faculty: 'Dr Satya', isLab: false },
      { time: '15:00-15:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '16:00-16:55', subject: 'Generative AI and Prompt Engineering', slot: 'K', faculty: 'Mr Atram', isLab: false },
      { time: '17:00-17:55', subject: 'Data Visualisation Analysis', slot: 'C', faculty: 'Dr MK Rao', isLab: false }
    ],
    Friday: [
      { time: '10:00-10:55', subject: 'Mathematics for Machine Learning', slot: 'B', faculty: 'Dr Nishad', isLab: false },
      { time: '11:00-11:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '14:00-15:55', subject: 'Digital Transformation-I', slot: 'Y', faculty: 'Guest faculty', isLab: false }
    ]
  },

  // ── M.Tech I Semester DSAI (Room No 319) ─────────────────────────────────
  MTech_DSAI: {
    Monday: [
      { time: '9:00-10:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '11:00-12:55', subject: 'Data Visualisation Analysis', slot: 'C', faculty: 'Dr MK Rao', isLab: false },
      { time: '15:00-15:55', subject: 'Cyber Security Fundamentals', slot: 'A', faculty: 'Dr Satya', isLab: false },
      { time: '16:00-16:55', subject: 'Foundation of Data Science', slot: 'E', faculty: 'Dr Anurag', isLab: false }
    ],
    Tuesday: [
      { time: '10:00-10:55', subject: 'Cyber Security Fundamentals', slot: 'A', faculty: 'Dr Satya', isLab: false },
      { time: '11:00-12:55', subject: 'Personality Development and Life Skills', slot: 'D', faculty: 'Dr Sresha', isLab: false },
      { time: '14:00-15:55', subject: 'Digital Transformation-I', slot: 'Y', faculty: 'Guest faculty', isLab: false }
    ],
    Wednesday: [
      { time: '9:00-9:55', subject: 'Foundation of Data Science', slot: 'E', faculty: 'Dr Anurag', isLab: false },
      { time: '12:00-12:55', subject: 'Data Visualisation Analysis', slot: 'C', faculty: 'Dr MK Rao', isLab: false }
    ],
    Thursday: [
      { time: '9:00-10:55', subject: 'Foundation of Data Science', slot: 'E', faculty: 'Dr Anurag', isLab: false },
      { time: '11:00-12:55', subject: 'Cyber Security Fundamentals', slot: 'A', faculty: 'Dr Satya', isLab: false },
      { time: '15:00-15:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '17:00-17:55', subject: 'Data Visualisation Analysis', slot: 'C', faculty: 'Dr MK Rao', isLab: false }
    ],
    Friday: [
      { time: '11:00-11:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '14:00-15:55', subject: 'Digital Transformation-I', slot: 'Y', faculty: 'Guest faculty', isLab: false }
    ]
  },

  // ── M.Tech I Semester ECE (Room No 320) ──────────────────────────────────
  MTech_ECE: {
    Monday: [
      { time: '9:00-10:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '11:00-11:55', subject: 'Optimization Algorithms', slot: 'N', faculty: 'Dr. Nisha', isLab: false },
      { time: '12:00-12:55', subject: 'Digital System Design', slot: 'F', faculty: 'Dr. Deepika', isLab: false },
      { time: '15:00-15:55', subject: 'AI for Autonomous Systems', slot: 'B', faculty: 'Dr. Shubhangi', isLab: false },
      { time: '16:00-16:55', subject: 'Foundations of Data Science', slot: 'E', faculty: 'Dr. Anurag', isLab: false },
      { time: '17:00-17:55', subject: 'VLSI Design', slot: 'W', faculty: 'Dr. Manoj', isLab: false }
    ],
    Tuesday: [
      { time: '9:00-9:55', subject: 'Intelligent Systems', slot: 'A', faculty: 'Dr. Bipin', isLab: false },
      { time: '10:00-10:55', subject: 'Microelectronics', slot: 'X', faculty: 'Dr. Manoj', isLab: false },
      { time: '11:00-12:55', subject: 'Personality Development and Life Skills', slot: 'D', faculty: 'Dr Sresha', isLab: false },
      { time: '14:00-15:55', subject: 'VLSI Design', slot: 'W', faculty: 'Dr. Manoj', isLab: false },
      { time: '16:00-17:55', subject: 'AI for Autonomous Systems', slot: 'B', faculty: 'Dr. Shubhangi', isLab: false }
    ],
    Wednesday: [
      { time: '10:00-10:55', subject: 'Microelectronics', slot: 'X', faculty: 'Dr. Manoj', isLab: false },
      { time: '11:00-12:55', subject: 'Programming Lab-1 (FPGA/Python)', slot: 'Z', faculty: 'Dr. Abhishek', isLab: true, venue: 'VLSI Lab' },
      { time: '15:00-15:55', subject: 'Intelligent Systems', slot: 'A', faculty: 'Dr. Shrivishal Tripathi', isLab: false },
      { time: '16:00-17:55', subject: 'Digital System Design', slot: 'F', faculty: 'Dr. Deepika', isLab: false }
    ],
    Thursday: [
      { time: '9:00-10:55', subject: 'Foundations of Data Science', slot: 'E', faculty: 'Dr. Anurag', isLab: false },
      { time: '11:00-11:55', subject: 'Programming Lab-1 (FPGA/Python)', slot: 'Z', faculty: 'Dr. Abhishek', isLab: true, venue: 'VLSI Lab' },
      { time: '12:00-12:55', subject: 'AI for Autonomous Systems', slot: 'B', faculty: 'Dr. Shubhangi', isLab: false },
      { time: '15:00-15:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '16:00-16:55', subject: 'Optimization Algorithms', slot: 'N', faculty: 'Dr. Nisha', isLab: false },
      { time: '17:00-17:55', subject: 'Foundations of Data Science', slot: 'E', faculty: 'Dr. Anurag', isLab: false }
    ],
    Friday: [
      { time: '9:00-10:55', subject: 'Microelectronics', slot: 'X', faculty: 'Dr. Manoj', isLab: false },
      { time: '11:00-11:55', subject: 'Data Structures and Algorithm Analysis', slot: 'G', faculty: 'Dr. Santosh / Dr. Satya / Prof. Srinivasa', isLab: false },
      { time: '12:00-12:55', subject: 'Digital System Design', slot: 'F', faculty: 'Dr. Deepika', isLab: false },
      { time: '14:00-15:55', subject: 'Intelligent Systems', slot: 'A', faculty: 'Dr. Bipin / Dr. Shrivishal Tripathi', isLab: false },
      { time: '16:00-16:55', subject: 'VLSI Design', slot: 'W', faculty: 'Dr. Manoj', isLab: false },
      { time: '17:00-17:55', subject: 'Optimization Algorithms', slot: 'N', faculty: 'Dr. Nisha', isLab: false }
    ]
  }
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimetableSync({ userBranch }) {
  const getInitialBranch = () => {
    if (!userBranch) return 'DSAI';
    const b = userBranch.toUpperCase();
    if (b.includes('CSE')) return b.includes('M.TECH') ? 'MTech_CSE' : 'CSE';
    if (b.includes('DSAI')) return b.includes('M.TECH') ? 'MTech_DSAI' : 'DSAI';
    if (b.includes('ECE')) return b.includes('M.TECH') ? 'MTech_ECE' : 'ECE';
    return 'DSAI';
  };

  const [selectedBranch, setSelectedBranch] = useState(getInitialBranch);
  const [selectedDay, setSelectedDay] = useState(() => {
    const dayIndex = new Date().getDay();
    const map = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday' };
    return map[dayIndex] || 'Monday';
  });

  const currentRoom = ROOM_MAPPING[selectedBranch] || 'Room No 135';
  const daySchedule = TIMETABLE_DATA[selectedBranch]?.[selectedDay] || [];

  return (
    <div className="bg-[#051209]/85 backdrop-blur-2xl border border-emerald-500/25 rounded-[28px] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <Calendar className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#4ade80] uppercase font-bold">
                [ TIMETABLE RADAR ]
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                [ OFFICIAL 2026-27 ]
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Class & Lab Telemetry</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#020703] border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-300">
            <MapPin className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>HALL: {currentRoom}</span>
          </div>

          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="appearance-none bg-[#020703] border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold px-4 py-2 pr-9 rounded-full cursor-pointer focus:outline-none focus:border-[#4ade80] transition-all"
            >
              <optgroup label="B.Tech Programmes (Sem 1)">
                <option value="DSAI">B.Tech • DSAI • Room 135</option>
                <option value="CSE">B.Tech • CSE • Room 138</option>
                <option value="ECE">B.Tech • ECE • Room 122</option>
              </optgroup>
              <optgroup label="M.Tech Programmes (Sem 1)">
                <option value="MTech_DSAI">M.Tech • DSAI • Room 319</option>
                <option value="MTech_CSE">M.Tech • CSE • Room 308</option>
                <option value="MTech_ECE">M.Tech • ECE • Room 320</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#4ade80] absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Day Selector Tabs Styled as Cyber Pill Dock */}
      <div className="grid grid-cols-5 gap-2 bg-[#020703] p-1.5 rounded-full border border-emerald-500/25">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-[#12311b] text-[#4ade80] border border-emerald-500/50 shadow-[0_0_12px_rgba(74,222,128,0.3)]'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-[#0c2213]/40'
              }`}
            >
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
              {day.slice(0, 3).toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {daySchedule.length === 0 ? (
          <div className="text-center py-12 bg-[#020703] border border-emerald-500/20 rounded-2xl text-emerald-400/60 font-mono text-sm">
            ● No sessions scheduled for {selectedDay}.
          </div>
        ) : (
          daySchedule.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 bg-[#020703] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold min-w-[120px] justify-center bg-emerald-500/10 text-[#4ade80] border border-emerald-500/30 shadow-[inset_0_0_8px_rgba(74,222,128,0.15)]">
                  <Clock className="w-3.5 h-3.5 text-[#4ade80]" />
                  {item.time}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{item.subject}</h4>
                    {item.isLab && (
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        <Beaker className="w-3 h-3" /> LAB
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-emerald-400/70 font-mono mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-500" /> {item.faculty}
                    </span>
                    {item.venue && (
                      <span className="flex items-center gap-1 text-[#4ade80] font-medium">
                        <MapPin className="w-3 h-3" /> {item.venue}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="border text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#081a0e] text-[#4ade80] border-emerald-500/30">
                  SLOT {item.slot}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}