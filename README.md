# IELTS BandAid - AI-Powered IELTS Writing Assessor

![IELTS BandAid Hero Section](https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1920&h=1080&fit=crop)

**Boost your IELTS Writing score with instant, AI-driven feedback. Get a free, detailed analysis of your writing tasks based on official IELTS criteria.**

### 🚀 [**Live Demo**](https://ieltsbandaid.pages.dev/) 🚀

---

## About The Project

IELTS BandAid is a free, open-source web application designed to help IELTS candidates improve their writing skills. It leverages the power of generative AI to provide an in-depth evaluation of IELTS Writing Task 1 (Academic & General) and Task 2 essays.

Users can either type their essays directly or upload images of their handwritten work. The application then returns a comprehensive report, including an estimated overall band score, a breakdown across the four official marking criteria, and actionable recommendations for improvement.

The goal of this project is to democratize IELTS preparation by providing every student with an accessible, on-demand writing tutor.

---

## ✨ Key Features

- **AI-Powered Assessment**: Get a detailed evaluation of your writing from a powerful AI trained on the official IELTS band descriptors.
- **Support for All Task Types**: Works with Task 1 (Academic and General) and Task 2.
- **Flexible Input Methods**: Submit your essay by either **typing text** or **uploading images** of your handwritten response.
- **Handwriting Recognition (OCR)**: Advanced AI accurately transcribes handwritten essays from images.
- **Detailed Score Breakdown**: Receive an estimated band score for each of the four official criteria:
  - Task Achievement / Response
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy
- **Constructive Feedback**: Get a clear list of your strengths, weaknesses, and key recommendations to help you improve.
- **Downloadable Reports**: Print or save your detailed assessment report as a PDF to track your progress.
- **Modern, Responsive UI**: A clean and intuitive interface that works beautifully on all devices.

---

## 🛠️ Technology Stack

This project is built with a modern, robust, and scalable technology stack.

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **AI Backend**: The frontend is powered by a separate [FastAPI](https://fastapi.tiangolo.com/) server that uses [Google's Gemini model](https://deepmind.google/technologies/gemini/) for transcription and evaluation.
- **Hosting**: Deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or a compatible package manager like Yarn or pnpm) installed on your machine.

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/get-npm)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/ielts-bandaid.git
    cd ielts-bandaid
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

4.  **Open the application:**
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The application frontend will be running. Note that for the assessment functionality to work, you will also need to set up and run the corresponding [backend service](https://github.com/m-arif-p/ielts-writing-ai-assessor) which handles the AI processing.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Md Arif - [@mdarifpro](https://twitter.com/mdarifpro)

Project Link: [https://github.com/m-arif-p/ielts-bandaid-frontend](https://github.com/m-arif-p/ielts-bandaid-frontend)
