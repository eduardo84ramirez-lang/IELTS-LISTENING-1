import { Type } from "@google/genai";

export interface Question {
  id: number;
  type: 'gap-fill' | 'multiple-choice' | 'matching' | 'map';
  text: string;
  options?: string[];
  answer: string;
  placeholder?: string;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  script: string;
  questions: Question[];
  isMultiSpeaker: boolean;
  speakers?: { name: string; voice: string }[];
}

export const ieltsTestData: Section[] = [
  {
    id: 1,
    title: "Section 1: Hotel Booking",
    description: "A conversation between a customer and a hotel receptionist.",
    isMultiSpeaker: true,
    speakers: [
      { name: "Receptionist", voice: "Kore" },
      { name: "Customer", voice: "Puck" }
    ],
    script: `
      Receptionist: Good morning, Grand Plaza Hotel. How can I help you?
      Customer: Hello, I'd like to book a room for June.
      Receptionist: Certainly. May I have your name, please?
      Customer: Yes, it's John Smith.
      Receptionist: Thank you, Mr. Smith. And a contact number?
      Customer: It's 07700 900123.
      Receptionist: Got it. What type of room were you looking for?
      Customer: A double room, please.
      Receptionist: And for which date?
      Customer: Starting from the 15th of June.
      Receptionist: For how many nights?
      Customer: Just for 3 nights.
      Receptionist: We have that available. Would you like breakfast included?
      Customer: Yes, please.
      Receptionist: Any special requests?
      Customer: I'd prefer a quiet room, away from the elevator if possible.
      Receptionist: I'll make a note of that. How will you be paying?
      Customer: By credit card.
      Receptionist: The total will be 240 pounds.
      Customer: That's fine.
      Receptionist: Your confirmation number is H789.
    `,
    questions: [
      { id: 1, type: 'gap-fill', text: "Name: ", answer: "John Smith", placeholder: "Enter name" },
      { id: 2, type: 'gap-fill', text: "Phone: ", answer: "07700 900123", placeholder: "Enter phone" },
      { id: 3, type: 'gap-fill', text: "Room type: ", answer: "Double", placeholder: "Enter room type" },
      { id: 4, type: 'gap-fill', text: "Date: ", answer: "15th June", placeholder: "Enter date" },
      { id: 5, type: 'gap-fill', text: "Length of stay: ", answer: "3 nights", placeholder: "Enter number of nights" },
      { id: 6, type: 'gap-fill', text: "Breakfast included: ", answer: "Yes", placeholder: "Yes/No" },
      { id: 7, type: 'gap-fill', text: "Special request: ", answer: "Quiet room", placeholder: "Enter request" },
      { id: 8, type: 'gap-fill', text: "Payment method: ", answer: "Credit card", placeholder: "Enter payment method" },
      { id: 9, type: 'gap-fill', text: "Total price: £", answer: "240", placeholder: "Enter amount" },
      { id: 10, type: 'gap-fill', text: "Confirmation number: ", answer: "H789", placeholder: "Enter code" },
    ]
  },
  {
    id: 2,
    title: "Section 2: Local Park Tour",
    description: "A guide talking about the history and layout of Green Valley Park.",
    isMultiSpeaker: false,
    script: "Welcome everyone to Green Valley Park. This park was established in 1925 by the Miller family. Originally, it was a private garden, but it opened to the public in 1950. To your left, you'll see the Rose Garden, which is famous for its 200 varieties of roses. In the center of the park, we have the Great Oak, which is over 300 years old. To the north, you'll find the children's playground, and to the south, the boating lake. If you walk east, you'll reach the Cafe, and to the west is the main entrance where we started.",
    questions: [
      { id: 11, type: 'multiple-choice', text: "When was the park established?", options: ["1925", "1950", "1900"], answer: "1925" },
      { id: 12, type: 'multiple-choice', text: "Who established the park?", options: ["The Smith family", "The Miller family", "The City Council"], answer: "The Miller family" },
      { id: 13, type: 'multiple-choice', text: "When did it open to the public?", options: ["1925", "1950", "1960"], answer: "1950" },
      { id: 14, type: 'multiple-choice', text: "How many varieties of roses are there?", options: ["100", "200", "300"], answer: "200" },
      { id: 15, type: 'multiple-choice', text: "How old is the Great Oak?", options: ["100 years", "200 years", "300 years"], answer: "300 years" },
      { id: 16, type: 'gap-fill', text: "Location of Playground: ", answer: "North", placeholder: "Direction" },
      { id: 17, type: 'gap-fill', text: "Location of Boating Lake: ", answer: "South", placeholder: "Direction" },
      { id: 18, type: 'gap-fill', text: "Location of Cafe: ", answer: "East", placeholder: "Direction" },
      { id: 19, type: 'gap-fill', text: "Location of Main Entrance: ", answer: "West", placeholder: "Direction" },
      { id: 20, type: 'gap-fill', text: "Location of Great Oak: ", answer: "Center", placeholder: "Direction" },
    ]
  },
  {
    id: 3,
    title: "Section 3: Research Project Discussion",
    description: "Two students, Sarah and Tom, discussing their science project with their tutor, Dr. Lee.",
    isMultiSpeaker: true,
    speakers: [
      { name: "Dr. Lee", voice: "Zephyr" },
      { name: "Sarah", voice: "Kore" },
      { name: "Tom", voice: "Puck" }
    ],
    script: `
      Dr. Lee: So, Sarah, Tom, how is your research on renewable energy coming along?
      Sarah: We've finished the literature review, Dr. Lee.
      Tom: But we're having some trouble with the data analysis part.
      Dr. Lee: What seems to be the problem?
      Sarah: We have too much data from the wind farm, and we're not sure which variables are most important.
      Dr. Lee: I suggest you focus on wind speed and power output first.
      Tom: That makes sense. We also wanted to ask about the presentation.
      Dr. Lee: It should be 15 minutes long, with 5 minutes for questions.
      Sarah: Should we include the raw data in the slides?
      Dr. Lee: No, just the summaries and charts.
      Tom: Okay. We'll aim to have the first draft ready by next Friday.
      Dr. Lee: Excellent. See you then.
    `,
    questions: [
      { id: 21, type: 'multiple-choice', text: "What is the topic of their research?", options: ["Solar energy", "Renewable energy", "Nuclear power"], answer: "Renewable energy" },
      { id: 22, type: 'multiple-choice', text: "What part have they already finished?", options: ["Data analysis", "Literature review", "Presentation"], answer: "Literature review" },
      { id: 23, type: 'multiple-choice', text: "Where did the data come from?", options: ["A solar farm", "A wind farm", "A hydro plant"], answer: "A wind farm" },
      { id: 24, type: 'multiple-choice', text: "What variables did Dr. Lee suggest focusing on?", options: ["Wind speed and temperature", "Wind speed and power output", "Power output and cost"], answer: "Wind speed and power output" },
      { id: 25, type: 'multiple-choice', text: "How long should the presentation be?", options: ["10 minutes", "15 minutes", "20 minutes"], answer: "15 minutes" },
      { id: 26, type: 'multiple-choice', text: "How much time is for questions?", options: ["5 minutes", "10 minutes", "15 minutes"], answer: "5 minutes" },
      { id: 27, type: 'multiple-choice', text: "What should be excluded from the slides?", options: ["Charts", "Summaries", "Raw data"], answer: "Raw data" },
      { id: 28, type: 'multiple-choice', text: "When will the first draft be ready?", options: ["Next Monday", "Next Wednesday", "Next Friday"], answer: "Next Friday" },
      { id: 29, type: 'multiple-choice', text: "Who is the tutor?", options: ["Dr. Smith", "Dr. Lee", "Dr. Miller"], answer: "Dr. Lee" },
      { id: 30, type: 'multiple-choice', text: "Who are the students?", options: ["Sarah and Tom", "Sarah and John", "Tom and John"], answer: "Sarah and Tom" },
    ]
  },
  {
    id: 4,
    title: "Section 4: Marine Biology Lecture",
    description: "A lecture about the Great Barrier Reef and its current threats.",
    isMultiSpeaker: false,
    script: "Good afternoon. Today we're discussing the Great Barrier Reef, the world's largest coral reef system. It stretches over 2,300 kilometers along the coast of Queensland, Australia. The reef is composed of over 2,900 individual reefs and 900 islands. However, it faces significant threats. The primary concern is coral bleaching, caused by rising ocean temperatures. When water is too warm, corals expel the algae living in their tissues, causing them to turn completely white. Another threat is the Crown-of-Thorns starfish, which preys on coral polyps. Pollution from agricultural runoff also contributes to the decline. Conservation efforts include reducing carbon emissions and improving water quality. Scientists are also experimenting with 'coral gardening' to restore damaged areas.",
    questions: [
      { id: 31, type: 'gap-fill', text: "The reef stretches over ", answer: "2,300", placeholder: "Number of km" },
      { id: 32, type: 'gap-fill', text: "It is located along the coast of ", answer: "Queensland", placeholder: "Location" },
      { id: 33, type: 'gap-fill', text: "Number of individual reefs: ", answer: "2,900", placeholder: "Number" },
      { id: 34, type: 'gap-fill', text: "Number of islands: ", answer: "900", placeholder: "Number" },
      { id: 35, type: 'gap-fill', text: "Primary threat: coral ", answer: "bleaching", placeholder: "Process" },
      { id: 36, type: 'gap-fill', text: "Cause of bleaching: rising ocean ", answer: "temperatures", placeholder: "Variable" },
      { id: 37, type: 'gap-fill', text: "Starfish that preys on coral: ", answer: "Crown-of-Thorns", placeholder: "Name" },
      { id: 38, type: 'gap-fill', text: "Pollution source: agricultural ", answer: "runoff", placeholder: "Source" },
      { id: 39, type: 'gap-fill', text: "Conservation effort: reducing carbon ", answer: "emissions", placeholder: "Target" },
      { id: 40, type: 'gap-fill', text: "New restoration method: coral ", answer: "gardening", placeholder: "Method" },
    ]
  }
];
