Doctor Clinic Booking Platform — Full Build Guide (MERN Stack)

What You Are Building
You are building a full-stack web application using MongoDB, Express.js, React.js, and Node.js. The website will look like a proper premium website when opened on a desktop browser. When opened on a mobile phone, it will look and feel exactly like a native mobile app — with a bottom navigation bar, smooth animations, card-based design, and no horizontal scrolling. It will support light and dark mode with a toggle. Users can find nearby doctor clinics using Google Maps, view doctor profiles, book appointments, and do the same things through WhatsApp using a bot. The entire system supports multiple languages.

Part 1 — Project Setup
Start by creating two folders inside one main project folder. One folder is called client for the React frontend. The other is called server for the Node and Express backend. This is called a monorepo structure.
Inside the server folder, run npm init -y to create a package.json. Then install these packages: express, mongoose, dotenv, cors, helmet, express-rate-limit, jsonwebtoken, bcryptjs, express-validator, multer, cloudinary, twilio, nodemailer, socket.io, axios, node-cron.
Inside the client folder, create the React app using npm create vite@latest and choose React with JavaScript. Then install these packages: react-router-dom, axios, react-query, zustand, framer-motion, react-i18next, i18next, @react-google-maps/api, react-hook-form, zod, @hookform/resolvers, date-fns, react-hot-toast, lucide-react, tailwindcss, and shadcn/ui.
Create a .env file in the server folder and add all your API keys there. Never commit this file to GitHub. Add it to .gitignore immediately.

Part 2 — Database Design (MongoDB)
You will create six main collections in MongoDB.
Users collection stores the patient's phone number, name, email, profile photo URL, preferred language, location coordinates, list of their booking IDs, role (patient or admin), whether their phone is verified, and timestamps.
Doctors collection stores the doctor's name, specialization (like Cardiologist or Dermatologist), profile photo, years of experience, consultation fee, languages they speak, their clinic reference ID, their average rating, total number of reviews, and whether their profile is verified.
Clinics collection stores the clinic name, full address, a GeoJSON location object with type Point and coordinates array (longitude first, then latitude — this is how MongoDB requires it), phone number, email, opening hours for each day of the week, list of doctor IDs working there, list of photos, and whether the clinic is currently active.
Appointments collection stores the patient user ID, the doctor ID, the clinic ID, the appointment date, the time slot as a string like "10:00 AM", the status (pending, confirmed, cancelled, completed), the booking channel (app or whatsapp), any notes the patient added, the consultation fee at time of booking, and timestamps.
Reviews collection stores the patient ID, doctor ID, clinic ID, a rating number from 1 to 5, a written comment, and the appointment ID it references.
WhatsappSessions collection stores the user's phone number, their current conversation state (like GREETING, LANGUAGE_SELECTED, LOCATION_RECEIVED, SHOWING_RESULTS, BOOKING_SLOT, CONFIRMED), their selected language, their last sent location coordinates, their selected clinic and doctor, and a timestamp for when the session was last active so you can expire old sessions.
After creating the Clinic model in Mongoose, add a geospatial index on the location field by calling ClinicSchema.index({ location: '2dsphere' }). This is what allows MongoDB to run fast location-based searches like "find all clinics within 5 kilometers of this coordinate."

Part 3 — Backend API (Node + Express)
Server entry point. Your main server.js file imports express, cors, helmet, dotenv, and mongoose. You connect to MongoDB Atlas using the connection string from your .env file. You apply helmet for security headers, cors configured to only allow your frontend's domain, and express.json() to parse request bodies. You then import and use all your route files.
Authentication routes. Create a route for requesting OTP, which takes a phone number and uses Twilio Verify to send an SMS with a 6-digit code. Create a route for verifying OTP, which checks the code with Twilio and if valid, creates the user in MongoDB if they don't exist yet, then returns a JWT access token and a refresh token. The JWT should expire in 15 minutes. The refresh token expires in 7 days and is stored as an httpOnly cookie. Create a middleware function that extracts the token from the Authorization header, verifies it, and attaches the user object to the request so other routes can use it.
Clinic and doctor routes. Create a GET route at /api/clinics/nearby that accepts latitude, longitude, radius in kilometers, and optional filters for specialty and rating. Inside this route, use MongoDB's $geoNear aggregation or $nearSphere query to find clinics within the radius. Join the doctors collection to pull doctor details for each clinic. Return the results sorted by distance. Create a GET route for a single clinic's full details including all doctors and their available slots for a given date. Create a GET route for a single doctor's profile including their reviews, average rating, and upcoming availability.
Slot availability logic. Create a utility function that takes a doctor ID and a date. It generates all possible time slots for that doctor on that day based on their working hours (for example, every 20 minutes from 9 AM to 1 PM and 4 PM to 8 PM). It then queries the Appointments collection to find all confirmed bookings for that doctor on that date. It removes those booked times from the generated list. The remaining times are the available slots. This function is called by the API whenever a user views a doctor's availability.
Booking routes. Create a POST route at /api/appointments that takes the doctor ID, clinic ID, date, and time slot. Before creating the booking, run the slot availability check again to make sure the slot is still free (race condition prevention). Use a MongoDB session and transaction to lock the slot and create the appointment atomically. After saving, send a WhatsApp confirmation message to the user using Twilio and schedule a reminder using node-cron for one hour before the appointment. Return the created appointment object.
Create routes for the user to get their booking history, cancel a booking (with a check that cancellation is at least 2 hours before the appointment), and reschedule to a new available slot.
WhatsApp webhook route. Create a POST route at /api/webhook/whatsapp that Twilio calls whenever a user messages your WhatsApp number. Parse the incoming message body and sender phone number. Look up the WhatsappSession document for that phone number. Based on the current state stored in that session, decide what to do next and send the appropriate reply using Twilio's REST API. After each interaction, update the session state in MongoDB to the next step in the flow. This is the core of the bot.
Image upload route. Create a route that accepts a file upload using multer (storing in memory, not disk), then uploads it to Cloudinary and returns the secure URL. Use this for doctor photos and clinic images.

Part 4 — WhatsApp Bot Conversation Flow
When a user sends any message for the first time or their session is expired, the state is GREETING. The bot replies with a welcome message and asks the user to pick a language. Send a WhatsApp interactive list message with options like English, Hindi, Marathi, Gujarati. Update the session state to AWAITING_LANGUAGE.
When the user replies with their language choice, save the language to the session. Update state to AWAITING_LOCATION. Reply asking them to share their current location using WhatsApp's location sharing feature, in the language they selected.
When the user sends a location message (which contains latitude and longitude in the Twilio webhook payload), save these coordinates to the session. Call your own /api/clinics/nearby endpoint with these coordinates and a 5km radius. Format the top 5 results as a WhatsApp interactive list with clinic name, distance, and specialty. Update state to SHOWING_RESULTS.
When the user picks a clinic from the list, save the clinic ID to the session. Reply with a list of doctors at that clinic, showing name, specialty, and fee. Update state to SELECTING_DOCTOR.
When the user picks a doctor, save the doctor ID. Reply with a date picker — since WhatsApp does not have a calendar UI, send a list of the next 7 available dates as buttons. Update state to SELECTING_DATE.
When the user picks a date, call the slot availability function and reply with available time slots as buttons (maximum 10 to fit WhatsApp's button limit). Update state to SELECTING_SLOT.
When the user picks a slot, show a summary of the booking details and ask them to confirm with a Yes/No button. Update state to AWAITING_CONFIRMATION.
When the user confirms, create the appointment in your database and send a confirmation message with all details. Update state to CONFIRMED and then clear the session after 10 minutes.

Part 5 — Frontend React App Structure
Folder structure inside src. Create a pages folder for full-page components. Create a components folder for reusable smaller pieces. Create a layouts folder for your app shell with navigation. Create a hooks folder for custom hooks. Create a store folder for Zustand global state. Create an i18n folder for translation JSON files. Create a lib folder for utility functions and API client setup.
Setting up Axios. In your lib folder, create an api.js file that creates an Axios instance with your backend URL as the base URL. Add a request interceptor that automatically attaches the JWT token from localStorage to every request's Authorization header. Add a response interceptor that catches 401 errors and automatically calls the refresh token endpoint, gets a new access token, and retries the original request. This way users stay logged in without interruption.
Setting up Zustand. Create a store with slices for auth state (user object, token, isLoggedIn), theme state (dark or light), and language state. Persist the theme and language to localStorage so the user's preference is saved between visits.
Setting up React Query. Wrap your app in a QueryClientProvider. Use React Query for all data fetching — clinic search results, doctor details, appointment lists. This gives you automatic caching, background refetching, loading and error states for free, and makes your app feel fast because it shows cached data instantly while refreshing in the background.
Setting up i18next. In your i18n folder, create JSON files named en.json, hi.json, mr.json, and gu.json. Each file has the same keys but different values in each language. For example, the key searchNearby has value "Search Nearby Clinics" in English and the equivalent in Hindi in the Hindi file. Initialize i18next with these files and set it to detect the user's preference from your Zustand store.
Pages you need to build. The Home page, Search/Map page, Clinic Detail page, Doctor Profile page, Book Appointment page, My Bookings page, User Profile page, Login page, and a 404 page.
Components you need to build. DoctorCard, ClinicCard, SlotPicker, MapView, BottomNavBar, TopBar, LanguageSwitcher, ThemeToggle, BookingCard, ReviewCard, LoadingSkeletons, and OTPInput.

Part 6 — Making It Look Like a Premium Mobile App
This is the most important part of the frontend work and deserves detailed explanation.
Constraining the layout. In your main layout component, wrap everything in a div that has a maximum width of 480 pixels and is horizontally centered using mx-auto. On desktop, this makes the content look like a phone in the center of the screen, which is exactly the premium mobile-app-on-web feel. You can optionally add a subtle border and shadow around this container on desktop to make it look like a phone frame. On mobile, it fills the entire screen naturally.
Bottom navigation bar. Create a fixed bottom nav bar that stays pinned to the bottom of the screen at all times. It has four icons: Home (house icon), Search (magnifier icon), Bookings (calendar icon), and Profile (person icon). Each icon has a small label below it. The active tab has a colored indicator — a small dot or filled icon. This is the single biggest thing that makes a website feel like a mobile app. Use Tailwind classes fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 and add max-w-[480px] mx-auto to match your container width.
Page transitions. Wrap each page component with Framer Motion's motion.div and set initial={{ opacity: 0, x: 20 }}, animate={{ opacity: 1, x: 0 }}, exit={{ opacity: 0, x: -20 }}, and transition={{ duration: 0.25 }}. Wrap your router outlet in Framer Motion's AnimatePresence. This makes every page slide in and out like a real mobile app.
Skeleton loaders. Never show a blank page or a spinner in the center. Instead, show skeleton placeholders — gray animated bars in the exact shape of the content that is loading. Use Tailwind's animate-pulse class on gray rounded divs shaped like cards, text lines, and images. When the data loads, smoothly fade in the real content using Framer Motion's opacity animation. This is what makes apps feel fast and premium even on slow connections.
Pull-to-refresh feeling. Add a loading indicator at the top of list pages that appears when data is refetching in the background. React Query's isFetching boolean makes this easy — show a thin colored progress bar at the top of the container when isFetching is true.
Touch-friendly design. Every tap target — every button, every card, every list item — must be at least 44 pixels tall. This is Apple and Google's guideline for touch targets. Use generous padding inside cards. Never use small text links on mobile.
Cards for everything. On mobile, every piece of content should be a card with rounded corners, subtle shadow or border, and comfortable padding. Doctor cards show the photo on the left, name and specialty in the middle, rating on the right, and distance below. Clinic cards show a wide image at the top and details below. Appointment cards show a colored left border indicating status (blue for upcoming, green for completed, red for cancelled).
Status bar color. Add a meta theme-color tag in your index.html to match your app's background color. This makes the browser's status bar on mobile blend with your app, completing the native feel.

Part 7 — Light and Dark Mode
Setting up dark mode in Tailwind. In your tailwind.config.js, set darkMode: 'class'. This means dark mode activates when the dark class is on the HTML root element.
Toggling the theme. In your Zustand store, have a theme value that is either 'light' or 'dark', and a toggleTheme function. The toggle function flips the value and saves it to localStorage. In your App.jsx, read this value from the store and add or remove the dark class from document.documentElement accordingly using a useEffect. This is all it takes.
Designing for both modes. Use Tailwind's dark variant for every color. For example, a card background is bg-white dark:bg-zinc-900. Text is text-zinc-900 dark:text-zinc-100. Borders are border-zinc-200 dark:border-zinc-800. Muted text is text-zinc-500 dark:text-zinc-400. Your primary accent color — let's say a teal or blue — stays the same in both modes or goes slightly lighter in dark mode.
The toggle button. Place a sun/moon icon toggle in the top bar of the app. When clicked, it calls toggleTheme. Animate the icon change using Framer Motion's AnimatePresence — the sun icon fades out and the moon icon fades in, or use a rotation animation. This small detail makes the feature feel premium.
System preference detection. On first visit, before the user has set a preference, check window.matchMedia('(prefers-color-scheme: dark)').matches and use the result as the default theme. This means the app automatically matches the user's phone's dark mode setting on first open.

Part 8 — The Home Page
The home page is what users see immediately after logging in. At the top, show a greeting like "Good morning, [Name]" with the current date below it. To the right, show the user's avatar as a small circular image. Below the greeting, show a search bar with a magnifier icon and placeholder text "Search doctors, clinics..." that navigates to the search page when tapped. Below the search bar, show a horizontal scrollable row of specialty filter chips — Cardiologist, Dermatologist, Neurologist, Orthopedic, General Physician, Dentist. Each chip is a pill-shaped button with an emoji icon and the specialty name. Tapping one goes to the search page pre-filtered.
Below the specialty chips, show a section called "Clinics Near You" with a "See all" link. Show 2 to 3 clinic cards horizontally scrollable. Each card shows a clinic photo, name, distance, and star rating.
Below that, show a section called "Upcoming Appointments" that fetches the user's next booking and shows it as a card. If they have no upcoming appointment, show a friendly illustration and a "Book your first appointment" button.
At the very bottom of the page content (above the bottom nav), show a banner card promoting the WhatsApp bot feature — "Book via WhatsApp" with a green WhatsApp icon and a "Try Now" button that opens WhatsApp with your bot's number pre-filled.

Part 9 — The Search and Map Page
This page has two views that the user can toggle between: a list view and a map view. Add two icon buttons at the top right — one for list view and one for map view.
In list view, show filter options at the top as a horizontal scroll of chips: specialty dropdown, distance slider (1km to 20km), minimum rating (3+, 4+, 4.5+), and sort by (Nearest, Highest Rated, Available Today). Below the filters, show the clinic and doctor results as a scrollable list of cards.
In map view, use the @react-google-maps/api package to show a Google Map centered on the user's current location. Use the browser's Geolocation API to get coordinates on page load, asking the user for permission. Show custom map markers for each clinic — use a custom SVG marker in your brand color instead of the default red pin. When a marker is tapped, show a small card at the bottom of the map (like a bottom sheet that slides up) with the clinic's photo, name, rating, and a "View Details" button. This bottom sheet is a fixed-position div at the bottom of the map container with a smooth translateY animation.
For getting the user's location, use navigator.geolocation.getCurrentPosition. On success, send the coordinates to your /api/clinics/nearby endpoint. While waiting for location permission, show a location permission request UI that explains why you need location access.

Part 10 — Clinic Detail and Doctor Profile Pages
The clinic detail page has a full-width image at the top (about 200 pixels tall) with a back arrow button overlaid on it. Below the image, show the clinic name, address, phone number, a row of star rating, a row of open/closed status based on current time and the clinic's hours, and a "Get Directions" button that opens Google Maps with the clinic's coordinates.
Below the header, show a list of doctors at this clinic. Each doctor has a circular photo, name, specialty, experience in years, consultation fee, and a "Book" button. Tapping the doctor takes the user to the doctor profile page.
The doctor profile page shows the doctor's photo as a large circular image centered at the top with their name and specialty below. Then shows a row of stats: years of experience, number of reviews, consultation fee. Below that, show a horizontal date picker — a scrollable row of the next 14 days, each day shown as a small pill with the day name above and date number below. Tapping a date calls the slot availability API for that doctor on that date.
Below the date picker, show the available time slots as a grid of pill buttons — morning slots, afternoon slots, and evening slots grouped with small gray section headers. Tapping a slot selects it (highlighted in your accent color) and shows a "Book Appointment" button at the bottom. If no slots are available for the selected date, show a message "No slots available for this day" with a suggestion to try the next day.
Below the slots, show the reviews section with each review card showing the reviewer's name initial as a colored circle, their rating as stars, their comment, and the date. Show a "Load more reviews" button if there are more than 5.

Part 11 — The Booking Confirmation Page
After the user taps "Book Appointment" on the doctor profile page, navigate to a booking confirmation page. This page shows a summary: doctor's name and photo, clinic name, selected date formatted nicely (like "Monday, 15 January 2026"), selected time slot, consultation fee, and a patient notes text area where they can add optional information for the doctor.
Below the summary, show two buttons: "Confirm Booking" in your accent color and "Go Back" as a secondary button.
When "Confirm Booking" is tapped, show a full-screen loading animation (your app logo spinning or a pulsing animation). When the API call succeeds, navigate to a success screen that shows a large checkmark animation (use Framer Motion to draw it with a path animation), the booking confirmation number, and all the details. Below that, show two options: "Add to Calendar" (which uses the Web Calendar API or a deep link) and "View My Bookings".
If the API fails because the slot was already taken by someone else, show an error toast and navigate back to the slot selection with a message "This slot was just booked. Please choose another time."

Part 12 — My Bookings Page
This page shows the user's appointments in two tabs: Upcoming and Past. Use a segmented control (two buttons with a sliding indicator) to switch between them.
Upcoming appointments are sorted by date, soonest first. Each card shows the doctor's photo, name, specialty, clinic name, date and time, status badge (Confirmed or Pending), and two action buttons: "Reschedule" and "Cancel". The cancel button should show a confirmation bottom sheet before proceeding.
Past appointments show Completed ones with a "Write Review" button and Cancelled ones with a "Book Again" button. Completed appointments that already have a review show the review summary instead of the button.

Part 13 — User Profile and Settings Page
The profile page shows the user's photo with a camera icon overlay for changing it, their name (tappable to edit), phone number, email, and preferred language.
Below that, show a settings list with rows for: Language (shows current language, taps to show language picker bottom sheet), Theme (shows Light/Dark toggle inline), Notifications (toggle switch), and About App.
At the bottom, show a "Logout" button in red text.

Part 14 — Responsive Design for Desktop
While the mobile layout is the main focus, the desktop experience should still be premium and not broken.
On desktop (screen width above 1024 pixels), show the content in the centered 480px container with a soft shadow and a thin border so it looks like a phone mockup in the browser. The background of the page (outside the container) should be a very subtle pattern or just a slightly different shade of the background color.
On the home page desktop view, you could optionally show a sidebar to the left of the phone container with marketing copy about the app: "Find Doctors Near You", a feature list, and a QR code linking to the WhatsApp bot. This makes the desktop experience feel intentional rather than just a stretched mobile view.
Add a proper browser favicon, Open Graph meta tags for link previews, and a web app manifest file so the site can be installed as a PWA from desktop Chrome as well.

Part 15 — Notifications and Real-time Updates
Use Socket.io to create a real-time connection between the client and server. When a user's booking is confirmed by the clinic (in the admin dashboard), emit a socket event to that user's room. On the client side, listen for this event and show a toast notification: "Your appointment with Dr. [Name] is confirmed!" without requiring a page refresh.
For appointment reminders, use node-cron on the server to run a job every 5 minutes that queries upcoming appointments in the next 60 minutes. For each one found that hasn't had a reminder sent, send a WhatsApp message to the patient and mark the reminder as sent. This is the automated reminder system.

Part 16 — Admin and Doctor Dashboard
This is a separate section of the app accessible only to users with the doctor or admin role. The middleware on the backend checks the user's role from the JWT token and returns 403 if they are not authorized.
Doctors log in and see their dashboard which shows today's appointments in a timeline view, a toggle to mark themselves as available or on leave, their profile editing form, and a slot management section where they can set their working hours and break times.
Admins can add new clinics, add and verify doctors, view all bookings across all clinics, and see a simple stats dashboard with total bookings this month, most active clinics, and most booked specialties.

Part 17 — Deployment
Deploy the React frontend to Vercel. Connect your GitHub repository, set the build command to npm run build and the output directory to dist. Add all your environment variables (VITE_API_URL, VITE_GOOGLE_MAPS_KEY) in Vercel's environment variable settings.
Deploy the Node backend to Railway or Render. Both offer free tiers sufficient for development and low-traffic production. Set all your server environment variables there. Make sure your MongoDB Atlas cluster allows connections from all IPs (0.0.0.0/0) or specifically from your hosting provider's IP range.
Set up your custom domain on Vercel if you have one. Make sure HTTPS is enabled (both Vercel and Railway do this automatically). Update the CORS settings in your Express server to use your production frontend domain instead of localhost.
Register your WhatsApp webhook URL with Twilio — it should be your backend's production URL followed by /api/webhook/whatsapp. Twilio will send a POST request to this URL whenever a user messages your WhatsApp number.

Summary of the Build Order
Build in this exact order to avoid getting stuck:
First, set up MongoDB with all your schemas and seed some fake doctor and clinic data. Second, build the auth API with OTP login and test it with Postman. Third, build the clinics nearby API and test with hardcoded coordinates. Fourth, build the slot availability and booking APIs. Fifth, start the React app with routing, layout, and theme setup. Sixth, build the home page and map page using your backend APIs. Seventh, build the doctor profile and booking flow. Eighth, add multilingual support. Ninth, add dark mode. Tenth, build the WhatsApp bot. Eleventh, polish animations and loading states. Twelfth, deploy.
This order means you always have something working and testable at each stage and you never build UI for features whose backend does not exist yet.

Doctor Clinic Booking Platform — Complete Upgraded Build Guide
Everything From Scratch, Every Feature, Every Screen, Every Logic

PART 0 — UNDERSTANDING WHAT YOU ARE BUILDING
You are building a platform with three types of users. First is the Patient, who downloads or opens the web app, creates an account using their phone number, searches for doctors near them, books appointments, manages their bookings, and can also do everything through WhatsApp. Second is the Clinic Owner or Admin, who registers their clinic on the platform, adds their doctors, manages appointment slots, confirms or cancels bookings, and views their dashboard. Third is the Super Admin, which is you, who approves clinics, manages the whole platform, sees analytics, and has full control.
The app works on mobile browsers like a native app with bottom navigation, smooth page transitions, and card-based layouts. On desktop it looks like a premium website with a centered phone-like container. Everything supports English, Hindi, Marathi, and Gujarati. There is full light and dark mode support.

PART 1 — PROJECT STRUCTURE SETUP
Create one main folder called doctor-booking-platform. Inside it create two folders: client and server.
Inside server run npm init -y. Then install these exact packages by running one command: npm install express mongoose dotenv cors helmet express-rate-limit jsonwebtoken bcryptjs express-validator multer cloudinary twilio nodemailer socket.io axios node-cron stripe uuid slugify.
Also install dev dependencies: npm install -D nodemon.
Inside client run npm create vite@latest . -- --template react. Then install: npm install react-router-dom axios @tanstack/react-query zustand framer-motion react-i18next i18next @react-google-maps/api react-hook-form zod @hookform/resolvers date-fns react-hot-toast lucide-react. Then install Tailwind by running npm install -D tailwindcss postcss autoprefixer and npx tailwindcss init -p.
Your server folder structure looks like this. Inside server create folders named config, controllers, middleware, models, routes, utils, and jobs. Your main file is server.js at the root of the server folder.
Your client folder structure inside src looks like this. Create folders named pages, components, layouts, hooks, store, i18n, lib, and assets. Inside pages create subfolders named patient, clinic, admin, and auth.

PART 2 — ENVIRONMENT VARIABLES
In the server folder create a .env file. Add these variables. PORT equals 5000. MONGODB_URI equals your MongoDB Atlas connection string. JWT_ACCESS_SECRET equals a long random string you make up. JWT_REFRESH_SECRET equals a different long random string. TWILIO_ACCOUNT_SID equals your Twilio SID. TWILIO_AUTH_TOKEN equals your Twilio token. TWILIO_VERIFY_SERVICE_SID equals the SID of your Twilio Verify service. TWILIO_WHATSAPP_NUMBER equals your Twilio WhatsApp sandbox number like whatsapp:+14155238886. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET equals your Cloudinary credentials. FRONTEND_URL equals http://localhost:5173 for development.
In the client folder create a .env file. Add VITE_API_URL equals http://localhost:5000/api. Add VITE_GOOGLE_MAPS_API_KEY equals your Google Maps API key.
Immediately add both .env files to .gitignore so you never accidentally upload them.

PART 3 — COMPLETE DATABASE DESIGN
You need eight collections. Here is every single field for each one.
Users Collection. This stores patient accounts. Fields are: _id (auto by MongoDB), name (string, required), phone (string, required, unique, this is how they log in), email (string, optional, unique if provided), profilePhoto (string, URL to Cloudinary image, default is empty string), dateOfBirth (date, optional), gender (string, enum of Male Female Other Prefer not to say), bloodGroup (string, optional), address (object with fields street, city, state, pincode), location (GeoJSON Point object for their saved home location), preferredLanguage (string, enum of en hi mr gu, default en), fcmToken (string, for push notifications), savedClinics (array of clinic IDs they bookmarked), bookingIds (array of appointment IDs), isPhoneVerified (boolean, default false), isActive (boolean, default true), role (string, always 'patient' for this collection), createdAt and updatedAt (auto timestamps).
ClinicOwners Collection. This stores clinic owner accounts separately from patients. Fields are: _id, name (string, required), phone (string, required, unique), email (string, required, unique), password (string, hashed, they use email plus password login unlike patients), profilePhoto (string URL), isPhoneVerified (boolean), isEmailVerified (boolean), ownedClinics (array of clinic IDs), role (string, value is 'clinic_owner'), isApprovedByAdmin (boolean, default false, you must approve them before they can list clinics), approvalDocuments (array of URLs — business license, medical council registration, etc.), bankDetails (object with accountNumber, ifscCode, accountName for future payment features), createdAt, updatedAt.
Clinics Collection. Fields are: _id, name (string, required), slug (string, unique URL-friendly version of the name), ownerId (reference to ClinicOwner), description (string, long text about the clinic), specializations (array of strings like Cardiology, Dermatology), photos (array of Cloudinary URLs), coverPhoto (string, the main display photo), address (object with street, city, state, pincode, landmark), location (GeoJSON Point, longitude first then latitude — this is critical), phone (string), alternatePhone (string), email (string), website (string, optional), openingHours (object with keys for each day like monday through sunday, each day has open boolean, startTime string like 09:00, endTime string like 21:00, breakStart optional, breakEnd optional), holidays (array of date objects for clinic holidays), amenities (array of strings like Parking, AC, Wheelchair Access, Lab, Pharmacy), paymentMethods (array of strings like Cash, Card, UPI), averageRating (number, computed and stored for performance), totalReviews (number), totalBookings (number), isVerifiedByAdmin (boolean, default false), isActive (boolean), isFeatured (boolean, you can mark premium clinics), createdAt, updatedAt.
Doctors Collection. Fields are: _id, name, phone, email, profilePhoto, bio (long text), specialization (string, primary specialty), additionalSpecializations (array), qualifications (array of objects each with degree, institute, year), experience (number in years), registrationNumber (medical council number, required for verification), clinicId (reference to Clinic they work at), consultationFee (number), followUpFee (number, often lower than first visit), availableSlotDuration (number in minutes, like 15 or 20 or 30, how long each appointment takes), workingDays (object same structure as clinic opening hours but specific to this doctor since a doctor might only work Tuesday Thursday Saturday), languages (array of strings they speak), averageRating, totalReviews, isVerified (boolean), isAvailableToday (boolean, they can toggle this off if they are sick), leavesDates (array of specific dates they are on leave), createdAt, updatedAt.
Appointments Collection. Fields are: _id, bookingId (string, human-readable ID like APT-2026-00001), patientId (reference to User), doctorId (reference to Doctor), clinicId (reference to Clinic), appointmentDate (date), timeSlot (string like 10:00 AM), timeSlotEnd (string like 10:20 AM), status (string, enum of pending, confirmed, checkedIn, completed, cancelled, noShow), type (string, enum of firstVisit, followUp), channel (string, enum of app, whatsapp, walkin), consultationFee (number at time of booking), paymentStatus (string, enum of unpaid, paid, refunded), paymentMethod (string), patientNotes (string, what patient tells doctor before appointment), clinicNotes (string, what clinic adds internally), prescriptionUrl (string, URL to uploaded prescription PDF after appointment), reminderSent (boolean), isRated (boolean), cancellationReason (string), cancelledBy (string, patient or clinic), cancelledAt (date), createdAt, updatedAt.
Reviews Collection. Fields are: _id, patientId, doctorId, clinicId, appointmentId (each appointment can only have one review), overallRating (number 1 to 5), doctorRating (number 1 to 5), waitTimeRating (number 1 to 5), facilityRating (number 1 to 5), comment (string), reply (string, clinic can reply to the review), repliedAt (date), isVisible (boolean, admin can hide inappropriate reviews), helpfulCount (number, other patients can mark a review as helpful), createdAt.
WhatsappSessions Collection. Fields are: _id, phone (string, unique), state (string, enum of all conversation states), language (string), location (object with lat and lng), selectedClinicId, selectedDoctorId, selectedDate, selectedSlot, tentativeBookingData (object holding all booking info before confirmation), lastActivityAt (date, used to expire sessions after 30 minutes of inactivity), messageCount (number).
Notifications Collection. Fields are: _id, userId (can be patient or clinic owner), userType (string, patient or clinicOwner), title (string), body (string), type (string, enum of bookingConfirmed, bookingCancelled, reminder, newReview, newBooking, accountApproved, etc.), relatedId (ID of the related appointment or review), isRead (boolean, default false), createdAt.
After defining the Clinic model, add ClinicSchema.index({ location: '2dsphere' }) for geospatial search. Add ClinicSchema.index({ specializations: 1 }) and ClinicSchema.index({ averageRating: -1 }) for filtering. On Appointments add compound index on doctorId and appointmentDate for fast slot lookup.

PART 4 — AUTHENTICATION SYSTEM (FULL DETAIL)
There are two completely separate login systems. Patients use phone number plus OTP. Clinic owners use email plus password.
Patient Authentication Flow
Step 1: Patient enters their phone number. The frontend sends a POST request to /api/auth/patient/send-otp with the body containing the phone number. The backend validates that the phone number is exactly 10 digits. It prepends the country code +91. It calls Twilio Verify's verifications.create with the phone number and channel 'sms'. Twilio sends a 6-digit OTP SMS. The backend responds with success and a message saying OTP sent.
Step 2: Patient enters the OTP. The frontend sends a POST request to /api/auth/patient/verify-otp with phone number and the 6-digit code. The backend calls Twilio Verify's verificationChecks.create with the phone and code. If Twilio returns status 'approved', the backend checks if a User with that phone exists in MongoDB. If user does not exist, create a new User document with just the phone number, set isPhoneVerified to true, and set a flag isNewUser to true. If user exists, just load them. Generate a JWT access token with the user ID, role, and phone inside it, set expiry to 15 minutes. Generate a refresh token with just the user ID, set expiry to 7 days. Save the refresh token hashed in the user document. Send back the access token in the response body and the refresh token as an httpOnly cookie with SameSite strict and Secure flags. Also send back the user object and the isNewUser boolean. If isNewUser is true, the frontend will redirect to a profile completion page before going to home.
Step 3: New patient completes profile. If isNewUser was true, show a screen asking for name, email (optional), date of birth (optional), and gender. This is a PATCH request to /api/auth/patient/complete-profile. Require at minimum the name. After saving, redirect to home page.
Step 4: Token refresh. Every API request attaches the access token. The Axios interceptor on the frontend catches 401 responses and automatically sends a POST to /api/auth/patient/refresh-token. The backend reads the refresh token from the httpOnly cookie, verifies it, checks it matches what is stored for that user, generates a new access token, and returns it. The Axios interceptor then retries the original failed request with the new token.
Step 5: Logout. Send a POST to /api/auth/patient/logout. Backend clears the refresh token from the user document and clears the cookie. Frontend clears the access token from memory and redirects to login.
Clinic Owner Authentication Flow
Registration Step 1. Clinic owner goes to a separate URL /clinic/register. They fill a form with their full name, email, phone number, and password (minimum 8 characters with at least one number). Frontend sends POST to /api/auth/clinic/register. Backend checks email is not already used. Hashes the password using bcryptjs with salt rounds of 12. Creates a ClinicOwner document with isApprovedByAdmin set to false. Sends a verification email using Nodemailer with a link containing a JWT token valid for 24 hours. Responds with a message saying check your email.
Registration Step 2. Owner clicks the email link which hits GET /api/auth/clinic/verify-email/:token. Backend verifies the JWT, finds the owner, sets isEmailVerified to true. Redirects to login page with a message saying email verified but account is pending admin approval.
Login. Owner goes to /clinic/login. Enters email and password. POST to /api/auth/clinic/login. Backend finds owner by email. Compares password using bcryptjs.compare. If password wrong, return 401. If isEmailVerified is false, return 403 with message to verify email. If isApprovedByAdmin is false, return 403 with message saying account is pending approval. Generate access and refresh tokens same as patient flow. Return tokens and owner object.
Admin Approval. When super admin logs in, they see a list of pending clinic owners. They click Approve which sends a PATCH to /api/admin/clinic-owners/:id/approve. This sets isApprovedByAdmin to true and sends a congratulations email to the owner.

PART 5 — ALL BACKEND API ROUTES
Auth Routes
POST /api/auth/patient/send-otp — sends OTP
POST /api/auth/patient/verify-otp — verifies OTP, returns tokens
PATCH /api/auth/patient/complete-profile — saves name and other info for new users
POST /api/auth/patient/refresh-token — gets new access token
POST /api/auth/patient/logout — clears tokens
POST /api/auth/clinic/register — creates clinic owner account
GET /api/auth/clinic/verify-email/:token — verifies email
POST /api/auth/clinic/login — clinic owner login
POST /api/auth/clinic/logout — clinic owner logout
POST /api/auth/clinic/forgot-password — sends reset email
POST /api/auth/clinic/reset-password/:token — resets password
Patient Routes (all require patient JWT)
GET /api/patient/profile — get own profile
PATCH /api/patient/profile — update profile fields
POST /api/patient/profile/photo — upload new profile photo
GET /api/patient/saved-clinics — get bookmarked clinics
POST /api/patient/saved-clinics/:clinicId — bookmark a clinic
DELETE /api/patient/saved-clinics/:clinicId — remove bookmark
GET /api/patient/notifications — get all notifications
PATCH /api/patient/notifications/:id/read — mark one as read
PATCH /api/patient/notifications/read-all — mark all as read
Clinic Search Routes (public, no auth needed)
GET /api/clinics/nearby — params: lat, lng, radius (km), specialty, minRating, sortBy
GET /api/clinics/:slug — full clinic details by slug
GET /api/clinics/:id/doctors — all doctors at a clinic
GET /api/clinics/:id/reviews — paginated reviews for a clinic
Doctor Routes (public)
GET /api/doctors/:id — full doctor profile
GET /api/doctors/:id/availability — params: date — returns available slots
GET /api/doctors/:id/reviews — doctor's reviews
Appointment Routes (require patient JWT)
POST /api/appointments — create booking
GET /api/appointments — patient's own bookings (query: status, upcoming, past)
GET /api/appointments/:id — single appointment details
PATCH /api/appointments/:id/cancel — cancel booking
PATCH /api/appointments/:id/reschedule — reschedule to new slot
Review Routes (require patient JWT)
POST /api/reviews — submit review for completed appointment
PATCH /api/reviews/:id — edit own review
POST /api/reviews/:id/helpful — mark review as helpful
Clinic Owner Dashboard Routes (require clinic owner JWT)
POST /api/clinic-owner/clinics — create new clinic listing
GET /api/clinic-owner/clinics — get all their clinics
PATCH /api/clinic-owner/clinics/:id — update clinic info
POST /api/clinic-owner/clinics/:id/photos — upload clinic photos
DELETE /api/clinic-owner/clinics/:id/photos/:photoId — delete photo
POST /api/clinic-owner/clinics/:id/doctors — add doctor to clinic
PATCH /api/clinic-owner/doctors/:id — update doctor info
DELETE /api/clinic-owner/doctors/:id — remove doctor
GET /api/clinic-owner/appointments — all appointments across their clinics (query: date, clinicId, status)
PATCH /api/clinic-owner/appointments/:id/confirm — confirm appointment
PATCH /api/clinic-owner/appointments/:id/cancel — cancel appointment
PATCH /api/clinic-owner/appointments/:id/complete — mark as completed
GET /api/clinic-owner/analytics — dashboard stats
POST /api/clinic-owner/reviews/:id/reply — reply to a review
PATCH /api/clinic-owner/doctors/:id/availability — toggle doctor availability
Admin Routes (require super admin JWT)
GET /api/admin/clinic-owners/pending — pending approvals
PATCH /api/admin/clinic-owners/:id/approve — approve clinic owner
PATCH /api/admin/clinic-owners/:id/reject — reject with reason
GET /api/admin/clinics — all clinics
PATCH /api/admin/clinics/:id/verify — verify a clinic
PATCH /api/admin/clinics/:id/feature — mark as featured
GET /api/admin/users — all patients
PATCH /api/admin/users/:id/deactivate — deactivate user
GET /api/admin/analytics — platform-wide stats
GET /api/admin/reviews — all reviews, can hide inappropriate ones
WebHook Route
POST /api/webhook/whatsapp — Twilio calls this for WhatsApp messages
Upload Route
POST /api/upload — upload any image, returns Cloudinary URL

PART 6 — SLOT AVAILABILITY LOGIC (DETAILED)
This is one of the most important pieces of backend logic. Here is exactly how it works.
Create a utility function in utils/slotGenerator.js. The function takes three arguments: doctor object, date as a Date object, and the array of already-booked time slots.
The function first checks if the given date is in the doctor's leavesDates array. If yes, return an empty array immediately.
The function checks the day of the week from the date (like Monday). It looks at the doctor's workingDays object for that day. If the doctor does not work that day, return empty array.
The function gets the doctor's startTime (like 09:00), endTime (like 21:00), breakStart (like 13:00), and breakEnd (like 17:00) for that day.
The function gets the doctor's availableSlotDuration in minutes.
Now the function generates all possible slots. Start from startTime. Add slotDuration minutes to get the next slot. Keep going until you reach endTime. But skip any slots that fall within the break period. The result is an array of time strings like ["09:00 AM", "09:20 AM", "09:40 AM", ..., "12:40 PM", "05:00 PM", ...].
The function then removes from this array any time strings that appear in the booked slots array.
The function also removes any slots that are in the past if the date is today. If it is 10:30 AM right now, do not show 09:00 AM or 10:00 AM as available.
Return the remaining array. Group the slots into three categories: Morning (before 12:00 PM), Afternoon (12:00 PM to 5:00 PM), Evening (after 5:00 PM). Return an object with three arrays.
In the API route GET /api/doctors/:id/availability, do this: get the doctor by ID, find all confirmed and pending appointments for that doctor on that date in the Appointments collection, extract just the timeSlot strings from those appointments, pass the doctor object, date, and booked time slots to the generator function, return the result.

PART 7 — BOOKING CREATION LOGIC (RACE CONDITION SAFE)
When a patient hits "Confirm Booking", the backend must handle the case where two patients try to book the same slot at the exact same moment.
In the booking POST route, start a MongoDB session by calling mongoose.startSession() and then session.startTransaction(). Wrap everything in try-catch.
First, re-run the slot availability check inside the transaction. Query for any existing appointment with the same doctorId, appointmentDate, timeSlot, and status not equal to cancelled. If one is found, abort the transaction and return a 409 Conflict error with message "This slot was just taken, please choose another."
If slot is free, create the appointment document within the session. Generate a human-readable booking ID by querying the total count of appointments and padding it like APT-2026-00001.
Commit the transaction. After committing, do these things asynchronously (do not make patient wait): send WhatsApp confirmation message, send SMS confirmation, create a Notification document for the patient, create a Notification document for the clinic owner, schedule a reminder cron job.
Return the created appointment with a 201 status.

PART 8 — WHATSAPP BOT (COMPLETE FLOW)
The bot handles the entire booking flow through natural WhatsApp conversation. Here is every state and every message.
State: IDLE or new user. Bot sends: "👋 Welcome to ClinicBook! Book doctor appointments in your area. Please choose your language: 1. English 2. हिंदी 3. मराठी 4. ગુજરાતી". Set state to AWAITING_LANGUAGE.
State: AWAITING_LANGUAGE. User sends 1, 2, 3, or 4. Save language. Set state to AWAITING_LOCATION. Send in chosen language: "Great! Please share your current location 📍 so I can find clinics near you. Tap the attachment icon and choose Location."
State: AWAITING_LOCATION. User shares location (Twilio gives you Latitude and Longitude in the message payload). Save coordinates. Call internal API to find top 5 clinics within 5km. Format them as a numbered list: "🏥 Clinics near you:\n1. City Care Clinic - 0.8 km - General, Cardiology\n2. ..." Ask user to reply with a number 1 to 5. Set state to SELECTING_CLINIC.
State: SELECTING_CLINIC. User sends a number. Save the selected clinic ID. Fetch the clinic's doctors. Send a numbered list of doctors: "👨‍⚕️ Doctors at City Care Clinic:\n1. Dr. Priya Sharma - Cardiologist - ₹500\n2. Dr. Rahul Mehta - General Physician - ₹300\nReply with a number to select a doctor." Set state to SELECTING_DOCTOR.
State: SELECTING_DOCTOR. User sends a number. Save doctor ID. Send the next 7 available dates (skip days when doctor does not work): "📅 Available dates for Dr. Priya Sharma:\n1. Monday, 16 Jan\n2. Tuesday, 17 Jan\n..." Set state to SELECTING_DATE.
State: SELECTING_DATE. User sends a number. Save date. Call slot availability function. If no slots available, message says "No slots available on this day. Reply 'back' to choose another date." If slots available, send up to 10 morning and afternoon slots: "🕐 Available time slots:\nMorning:\n1. 9:00 AM\n2. 9:20 AM\n...\nEvening:\n8. 5:00 PM\nReply with a number." Set state to SELECTING_SLOT.
State: SELECTING_SLOT. User sends a number. Save time slot. Create a summary and ask for confirmation: "✅ Booking Summary:\nDoctor: Dr. Priya Sharma (Cardiologist)\nClinic: City Care Clinic\nDate: Monday, 16 January 2026\nTime: 10:00 AM\nFee: ₹500\n\nReply YES to confirm or NO to cancel." Set state to AWAITING_CONFIRMATION.
State: AWAITING_CONFIRMATION. If user sends YES (case insensitive), create the appointment using the booking creation logic. Send confirmation: "🎉 Appointment Confirmed!\nBooking ID: APT-2026-00234\nDr. Priya Sharma\n16 Jan 2026 at 10:00 AM\nCity Care Clinic\n\nWe will remind you 1 hour before. To view or manage your bookings, visit: [your app URL]". Set state to CONFIRMED. Schedule reminder.
If user sends NO, send "Booking cancelled. Type 'hi' to start again." Reset session.
Handling 'back' command. At any state if user sends 'back', go to the previous state and resend the question.
Handling 'help' command. At any state, send a help message explaining commands.
Session expiry. A cron job runs every 10 minutes. It finds all WhatsappSessions where lastActivityAt is older than 30 minutes. It deletes those sessions. Next time that user messages, they start fresh.

PART 9 — FRONTEND: COMPLETE APP SHELL AND NAVIGATION
App Entry Point
Your App.jsx does these things. It reads the theme from Zustand store and applies or removes the dark class on document.documentElement. It reads the language preference and initializes i18next with it. It wraps everything in QueryClientProvider for React Query. It wraps everything in Toaster from react-hot-toast. It defines all routes using React Router DOM's BrowserRouter.
Route Structure
Public routes (no login needed): /login, /clinic/login, /clinic/register, /clinic/verify-email, /forgot-password, /404.
Patient protected routes: / (home), /search (map and list), /clinics/:slug (clinic detail), /doctors/:id (doctor profile), /book/:doctorId (booking page), /booking-success/:appointmentId (success page), /appointments (my bookings), /appointments/:id (booking detail), /profile (patient profile and settings), /notifications.
Clinic owner protected routes (different layout): /clinic/dashboard, /clinic/clinics, /clinic/clinics/new, /clinic/clinics/:id/edit, /clinic/clinics/:id/doctors, /clinic/appointments, /clinic/analytics, /clinic/profile, /clinic/reviews.
Admin routes: /admin/dashboard, /admin/approvals, /admin/clinics, /admin/users, /admin/analytics.
Layout Components
Create PatientLayout.jsx. This renders the top bar at the top, the page content in the middle inside the 480px max-width centered container, and the bottom navigation bar fixed at the bottom. Add 80px of bottom padding to all page content so content is never hidden behind the bottom nav.
Create ClinicOwnerLayout.jsx. This has a sidebar on desktop (hidden on mobile) and a different top nav. On mobile it has a bottom nav with clinic-specific items: Dashboard, Appointments, Clinics, Reviews, Profile.
Create AdminLayout.jsx. Full desktop sidebar layout, no mobile optimization needed since admin uses desktop.
Top Bar Component
The top bar for the patient app shows on every page but changes based on which page you are on. On the home page it shows the app logo on the left and a bell icon (notifications) plus a dark mode toggle on the right. On inner pages it shows a back arrow on the left, the page title in the center, and relevant action buttons on the right. The back arrow calls navigate(-1) from React Router. The bell icon shows a red dot badge if there are unread notifications.
Bottom Navigation Bar Component
Four tabs. Home icon with label "Home", navigate to /. Search icon with label "Search", navigate to /search. Calendar icon with label "Bookings", navigate to /appointments. User icon with label "Profile", navigate to /profile.
The active tab has the icon and label in your accent color (use a teal like #0EA5E9). Inactive tabs are gray. When switching tabs, the active indicator animates smoothly using Framer Motion's layout prop on the colored indicator element. This means the colored dot slides smoothly from one tab to the other instead of jumping.
Add a subtle haptic-like animation: when a tab is tapped, scale it down to 0.9 and back to 1 using Framer Motion in 150 milliseconds.
Page Transition System
Create a PageTransition.jsx wrapper component. Inside it use Framer Motion's motion.div with initial={{ opacity: 0, y: 10 }}, animate={{ opacity: 1, y: 0 }}, exit={{ opacity: 0, y: -10 }}, and transition={{ duration: 0.2, ease: 'easeOut' }}. Wrap every page component with this. In App.jsx wrap the Routes component with Framer Motion's AnimatePresence with mode="wait". This makes every page transition feel smooth and native.

PART 10 — LOGIN AND SIGNUP PAGES (PATIENT)
Phone Number Entry Screen
The URL is /login. The page has a large teal gradient background at the top taking up about 40% of the screen showing the app logo, app name "ClinicBook", and a tagline like "Your health, our priority". Below the gradient, a white card slides up with a heading "Enter your mobile number". Below the heading is a phone input with a country code picker showing the Indian flag and +91 by default, and an input for the 10-digit number. Below that is a "Get OTP" button in teal. Below the button is small text "By continuing you agree to our Terms and Privacy Policy" with links.
When the user types their phone number, validate it in real-time. The input should have a green checkmark icon inside it when the number is exactly 10 digits. The "Get OTP" button should be disabled and gray when the number is not valid, and teal when valid.
When the button is tapped, show a loading spinner inside the button, disable it, and make the API call. On success, animate the phone input screen sliding out to the left and the OTP screen sliding in from the right.
OTP Entry Screen
Show the message "We sent a 6-digit OTP to +91 XXXXXX1234" with the last 4 digits visible. Below that show six individual input boxes for each digit of the OTP. Each box is a square, about 50px by 50px, with a bottom border only by default and a full border when focused.
When the user types a digit, automatically move focus to the next box. When they press backspace on an empty box, move focus back. If they paste a 6-digit number, automatically fill all boxes.
Below the OTP inputs, show a countdown timer: "Resend OTP in 0:45" counting down. When it reaches 0, show a "Resend OTP" button. Show "Didn't receive OTP? Check spam folder" in small gray text.
Show a "Change Number" link to go back. When 6 digits are entered, automatically submit the form without the user needing to press a button. Show a loading animation. On success, show a checkmark animation and navigate.
New User Profile Completion Screen
After first login, show a friendly screen: "Tell us about yourself 👋". Show fields for Full Name (required), Email (optional), Date of Birth (optional, date picker), and Gender (optional, segmented control with Male, Female, Other, Prefer not to say). The only required field is name. Show a progress bar at the top showing step 2 of 2. Show a "Continue" button. If user taps "Skip for now", save just the phone number and go to home with a banner saying "Complete your profile for a better experience".

PART 11 — CLINIC OWNER REGISTRATION AND LOGIN PAGES
Registration Page
URL is /clinic/register. Full-page form (not the 480px mobile container, this uses a wider layout). Show a two-column layout on desktop: left column has marketing copy about why clinics should list on the platform (reach more patients, manage appointments, no setup fee), right column has the registration form. On mobile, only the form shows.
Form fields: Full Name, Email, Phone, Password, Confirm Password, and a checkbox "I agree to the Terms for Clinic Partners".
Below the form, show a section for uploading documents: "Upload supporting documents (medical license, registration certificate)". Allow multiple file uploads. Show uploaded files as a list with a delete button.
Show a "Create Account" button. On success, show a success screen with an envelope illustration and message "Registration Successful! We have sent a verification link to your email. Please verify your email to proceed."
Verification Pending Screen
After email verification, when the clinic owner tries to log in, if their account is pending admin approval, show a specific screen: an hourglass illustration, heading "Account Under Review", message "Our team is reviewing your documents and will approve your account within 24-48 hours. You will receive an email once approved." Show a "Contact Support" link.
Clinic Owner Login Page
URL is /clinic/login. Clean form with Email and Password fields. "Forgot Password" link. "Login" button. Below the form, "Don't have an account? Register as a Clinic Partner" link. Also add a link saying "Are you a patient? Patient Login" to avoid confusion.

PART 12 — HOME PAGE (PATIENT)
The home page has several sections stacked vertically with comfortable spacing.
Section 1: Personalized Header
Fixed at the top inside the page (below the app top bar). Left side shows "Good morning, Rahul 👋" with the greeting changing based on time (Good morning before 12, Good afternoon until 5, Good evening after 5). Below the greeting shows today's date like "Thursday, 15 May". Right side shows the patient's profile photo as a 44px circle with a thin teal border. Tapping the photo goes to profile page.
Section 2: Search Bar
A prominent tappable search bar (it does not expand in place, it navigates to the search page and focuses the search input there). Rounded full, white background in light mode, dark gray in dark mode. Subtle shadow. Shows a magnifier icon on the left and "Search doctors, clinics, specialties..." as placeholder text. Show a microphone icon on the right (for future voice search, for now just show it).
Section 3: Quick Action Chips
Horizontal scrollable row with no scroll bar visible. Each chip is a pill-shaped button with a colored emoji icon and a label. The chips are: 🫀 Cardiology, 🦷 Dentist, 🧠 Neurology, 🦴 Orthopedic, 👁 Eye, 🩺 General, 👶 Pediatric, 🧴 Dermatology. Tapping a chip goes to search page with that specialty pre-selected as a filter.
Section 4: Upcoming Appointment Card
Show a heading "Upcoming Appointment" with a "View all" link. If the patient has an upcoming appointment, show a card with a blue-to-teal gradient left border stripe. Inside: doctor's photo, doctor name, specialty, clinic name, date and time in bold, status badge. Two small buttons at the bottom of the card: "Directions" (opens Google Maps) and "Reschedule". If no upcoming appointment, show a soft illustrated empty state card with a calendar illustration and "No upcoming appointments. Book one now!" button.
Section 5: Nearby Clinics
Heading "Clinics Near You" with "See all" link. Horizontal scrollable row of clinic cards. Each card is about 220px wide and 160px tall. Shows the clinic cover photo taking top 60% of the card, clinic name in bold, specialty tags as tiny pills, star rating, and distance. Tapping goes to the clinic detail page. If location permission has not been granted, show a card that says "Enable location to see nearby clinics" with an "Enable Location" button.
Section 6: Top Rated Doctors
Heading "Top Rated Doctors Near You". Vertical list (not horizontal scroll) of 3 to 4 doctor cards. Each card shows doctor photo, name, specialty, years of experience, rating, consultation fee, and a "Book" button. "Book" button is small, teal, rounded full, and navigates to the doctor profile page.
Section 7: WhatsApp Bot Promo Card
A card with green gradient background. WhatsApp icon on the left. Heading "Book via WhatsApp" with subtext "No app needed! Send 'Hi' to our WhatsApp number". A "Start Chat" button that opens https://wa.me/[your-number]?text=Hi in a new tab. This card is at the bottom of the scrollable content before the bottom nav.

PART 13 — SEARCH AND MAP PAGE
Header
A back button on the left. A text input in the center that is already focused and has a cursor blinking when the page loads. A filter icon button on the right that opens the filter bottom sheet.
Search Input Behavior
As the user types, show autocomplete suggestions below the input in a dropdown card. The suggestions are a mix of doctor names, clinic names, and specialty names fetched from a /api/search/autocomplete endpoint. Each suggestion has a small icon (stethoscope for doctor, building for clinic, tag for specialty), the name, and a subtitle. Tapping a suggestion either goes to the doctor or clinic detail page, or fills the search and filters by specialty.
Filter Bottom Sheet
Tap the filter icon and a bottom sheet slides up from the bottom. The sheet has a drag handle at the top. Contains: Specialty dropdown (searchable list of all specialties), Distance slider from 1km to 20km with a teal thumb, Minimum Rating buttons (Any, 3+, 4+, 4.5+), Sort By buttons (Nearest, Top Rated, Available Today, Fees: Low to High). An "Apply Filters" button at the bottom. A "Reset" link at the top right.
View Toggle
Two icon buttons at the top right of the results area. List view icon and Map view icon. The active one has a teal background, inactive is gray. Switching between views uses a smooth fade animation.
List View
Below the header, show a count like "24 clinics found near you". Then a vertical scrollable list of clinic cards. Each card shows clinic photo, name, specialty tags, rating, distance, open or closed status, and a "View" button. Below each clinic card, show the doctors at that clinic as small horizontal chips: "Dr. Sharma (Cardiology) · Dr. Mehta (General)". The list supports infinite scroll using React Query's useInfiniteQuery — when the user scrolls to the bottom, the next page automatically loads.
Map View
Full-screen Google Map filling the available space. Show custom teal circular markers for each clinic. The marker shows a number if multiple clinics overlap. When a marker is tapped, a bottom sheet slides up showing: clinic photo on the left, name, rating, distance, open or closed badge, and "View Details" button. The map has a floating button "Use My Location" that recenters the map to the user's current location.
Location Permission Handling
On page load, immediately request location permission using navigator.geolocation.getCurrentPosition. If permission is denied, show a non-dismissable banner at the top of the page: "Location access is needed to find nearby clinics. Please enable location in your browser settings." with a small illustration. Do not show any results until location is available (or the user manually enters a location in the search bar).

PART 14 — CLINIC DETAIL PAGE
Hero Section
Full-width image carousel at the top showing the clinic's photos. Height is about 220px. Show white navigation arrows on both sides. Show dots at the bottom indicating current photo. Show a gradient overlay at the bottom of the image fading to dark so the clinic name on top of it is readable. Show the clinic name in white bold text at the bottom of the hero image. Show a back arrow at the top left inside the image.
Action Row
Below the hero, a row of four action buttons: a phone icon button (taps to call the clinic phone number), a directions button (opens Google Maps), a share button (uses Web Share API to share the clinic link), and a bookmark button (saves clinic to the patient's saved list in Zustand and backend).
Info Section
Clinic description paragraph. A row showing the open or closed badge plus today's hours like "Open · 9:00 AM – 9:00 PM". A row showing the address. A row showing specialties as colored pills. A row showing amenities as small chips with icons (🅿️ Parking, ❄️ AC, ♿ Wheelchair, 🧪 Lab, 💊 Pharmacy).
Doctors Section
Heading "Our Doctors" with the count. Each doctor shown as a card with photo, name, specialty, experience, fee, and a large "Book Appointment" button. Tapping "Book Appointment" goes to the doctor profile page. Add a filter row above the doctor list to filter by specialty.
Reviews Section
Show summary at the top: large rating number (like 4.7), star visual, total review count, and a bar chart showing distribution of 1 through 5 star ratings. Below that, paginated review cards. Each review card shows the reviewer's initials in a colored circle (generate the color deterministically from the name so the same person always gets the same color), their rating as stars, the date formatted like "2 weeks ago", the comment text, and a helpful button. If the clinic has replied to the review, show the reply in a slightly indented block with a small clinic icon.

PART 15 — DOCTOR PROFILE PAGE
Doctor Header
Centered at the top: the doctor's circular profile photo (100px diameter) with a verified checkmark badge if verified. Doctor name in large bold. Specialty in teal. Clinic name as a tappable link below the specialty (goes to clinic page).
Stats Row
A row of three stat cards: Experience (X years), Reviews (X reviews), Fee (₹X). Each stat is a number in large bold with a label below.
About Section
The doctor's bio paragraph. Their qualifications listed (MBBS from XYZ, MD Cardiology from ABC). Languages they speak as flag chips.
Date Picker
Heading "Select Date". A horizontal scrollable row of date pills for the next 14 days. Each pill shows the 3-letter day name (Mon, Tue) on top and the date number (16, 17) below. The pill for today says "Today" instead of the day name. If a date is unavailable (doctor on leave or does not work that day), the pill is grayed out and not selectable. The selected date pill has a filled teal background.
Time Slots
Below the date picker, show a loading skeleton briefly, then the grouped slots: "🌅 Morning" header followed by morning slot pills, "☀️ Afternoon" header, "🌆 Evening" header. Each slot is a pill button. Tapping a slot highlights it in teal and shows a "Proceed to Book" button sliding up from the bottom with a smooth animation.
If no slots are available for the selected date, show a friendly illustration with "No available slots on this day. Dr. Sharma is usually available on weekdays." with next available date suggestion.
Reviews
Same structure as clinic reviews but scoped to this doctor.

PART 16 — BOOKING PAGE
Summary Card
Show a card at the top with all booking details. Doctor photo and name. Clinic name with address. Date in friendly format. Time slot. Fee amount. A dotted divider. Total payable.
Patient Notes Input
A text area with label "Any notes for the doctor (optional)". Placeholder: "E.g., This is a follow-up for my back pain. I have been taking Ibuprofen." Character limit 500 shown as a counter like "0/500".
Visit Type Toggle
Two options: "First Visit" and "Follow Up". Toggle between them. Follow up fee might be lower. Show the fee update dynamically.
Terms Checkbox
"I confirm the appointment details are correct and I agree to the cancellation policy (cancellations must be made 2 hours in advance)."
Confirm Button
Large teal button "Confirm Appointment". Disabled until terms checkbox is checked. When tapped, shows a loading animation with the button text changing to "Booking your slot...". If success, navigate to success screen. If slot conflict error, show a toast "Oops! This slot was just taken. Choosing the next available..." and automatically go back to the slot picker highlighting the conflicting slot in red.

PART 17 — BOOKING SUCCESS PAGE
The entire page is a success animation. A white background with a large animated checkmark SVG drawn using Framer Motion's pathLength animation from 0 to 1 in 0.6 seconds. Below the checkmark, "Appointment Confirmed! 🎉" in large bold. The booking ID like "APT-2026-00234" in a code-style font. All booking details in a summary card.
Below the summary, three action buttons stacked: "Add to Calendar" (opens native calendar or shows instructions), "Share Booking" (Web Share API), "View My Bookings". A confetti animation using a simple canvas-based confetti effect plays when the page loads.

PART 18 — MY BOOKINGS PAGE
Tabs
Three tabs: "Upcoming", "Completed", "Cancelled". A sliding indicator under the active tab. Tab switching uses a slide animation.
Upcoming Appointments
Sorted by date ascending. Each card has a blue left border. Shows doctor photo, name, specialty, clinic name, date and time, status badge (Confirmed = green, Pending = yellow). Two buttons: "Reschedule" and "Cancel". The Cancel button shows a confirmation bottom sheet with the cancellation policy reminder before proceeding.
Completed Appointments
Each card has a green left border. Shows all details plus a "Write a Review" button if no review exists, or a small star rating preview if review was already submitted. Shows "Book Again" button.
Cancelled Appointments
Each card has a red left border. Shows who cancelled (You or Clinic) and the reason. Shows "Book Again" button.
Empty State
For each tab, if empty, show a contextually appropriate illustration. For Upcoming empty: calendar with a plus, "No upcoming appointments. Ready to book?", and a "Find Doctors" button. For Completed empty: "No completed appointments yet." For Cancelled empty: "No cancelled appointments."

PART 19 — CLINIC DETAIL BOOKING FLOW (APPOINTMENT DETAIL PAGE)
When a patient taps on a specific appointment in My Bookings, they see the full detail page. Shows all booking information. Shows a QR code that the clinic can scan when the patient arrives (the QR encodes the booking ID). Shows appointment status timeline: Booked → Confirmed → Completed. If the appointment is Confirmed by the clinic, the status shows a filled teal dot. If not yet confirmed, it shows a pulsing dot.

PART 20 — PATIENT PROFILE PAGE
Profile Header
User photo (tappable to change) with a camera icon overlay. Name in bold (tappable to edit). Phone number (not editable, shown in gray). Email (tappable to edit or add). A "Edit Profile" button.
Quick Stats
A row showing: Appointments count, Reviews written count, Member since date.
Settings Section
Rendered as a list of rows with a right-pointing chevron. Language row shows the current language flag and name. Tapping opens a bottom sheet with language options. Theme row shows a sun or moon icon. Has an inline toggle switch. Notifications row has an inline toggle switch. Help & Support row. Privacy Policy row. Terms of Service row.
Saved Clinics Section
A horizontal scrollable row of the clinics the user bookmarked. Each as a small card.
Danger Zone
At the very bottom, "Logout" in red text. Tapping shows a confirmation dialog. Also "Delete Account" in lighter red text below that, with a stronger confirmation flow.

PART 21 — CLINIC OWNER DASHBOARD
When a clinic owner logs in they see a completely different interface from patients.
Dashboard Overview Page
Shows a greeting with the owner's name. Shows a quick stats row: Today's Appointments count, Pending Confirmations count, This Month's Revenue (shown only if payment feature is on), Average Rating.
Shows a "Today's Appointments" section with a timeline view. The timeline shows hours (9 AM to 9 PM) on the left and appointment blocks on the right showing patient name, time, doctor, and status. Color coded: pending is yellow, confirmed is blue, completed is green, cancelled is red and strikethrough.
Shows recent reviews that have not been replied to yet. Shows a "Reply" button on each.
Clinic Management Page
List of all clinics owned by this owner. Each clinic card shows photo, name, verification status badge (Verified or Pending), active or inactive toggle, number of doctors, total appointments, rating. Two buttons: "Edit" and "Manage Doctors".
Add or Edit Clinic Form
Multi-step form. Step 1: Basic Info (name, description, phone, email, website). Step 2: Location (map picker — show a Google Map, user drags a pin to exact location, coordinates are auto-captured). Step 3: Specializations (multi-select chips). Step 4: Opening Hours (a table with each day having an on/off toggle and time inputs). Step 5: Amenities (checkboxes). Step 6: Photos (upload up to 10 photos, drag to reorder). Step 7: Documents (upload license for verification). Step 8: Review and Submit.
After submitting, show a message "Clinic submitted for verification. Our team will review within 24-48 hours."
Doctor Management Page
For a selected clinic, shows all doctors. Each doctor card has photo, name, specialty, experience, fee, a toggle for "Available Today", and edit and remove buttons.
Add Doctor form: Name, specialization, experience, qualifications, consultation fee, follow-up fee, working days and hours, slot duration, photo upload.
Appointments Management Page
Top filters: clinic selector dropdown, date picker, status filter, doctor filter. Results shown as a table on desktop or as cards on mobile. Each row or card shows booking ID, patient name, doctor, time, status, booking channel (app or WhatsApp). Action buttons: Confirm, Cancel (with reason), Mark Completed, View Details.
Bulk actions: "Confirm all pending for today", "Mark all checked-in as completed".
When a clinic owner clicks a patient's name, they see a side panel with the patient's booking history at their clinic only (not their history at other clinics, for privacy).
Reviews Page
All reviews for their clinics. Shows review card with patient name initial, rating, comment, date. If not replied, shows a "Reply" text input and "Post Reply" button. Replied reviews show the reply. Cannot edit or delete reviews, only reply.
Analytics Page
Shows monthly booking count as a line chart using Recharts. Shows top doctors by booking count as a horizontal bar chart. Shows booking channel split (App vs WhatsApp) as a pie chart. Shows most popular time slots as a heat map grid (hours on one axis, days on the other). Shows revenue trend if payment is on. Date range filter at the top.

PART 22 — SUPER ADMIN PANEL
Approvals Page
A table of clinic owners who have registered and verified their email but are waiting for admin approval. Shows name, email, phone, registration date, uploaded documents. "View Documents" button opens documents in a modal. "Approve" button turns green. "Reject" button opens a dialog to type a rejection reason before confirming.
Clinics Management
Table of all clinics on the platform. Filter by verified or not, active or not, city. Can verify clinics, mark as featured, deactivate.
Users Management
Table of all patients. See their profile, booking count, join date. Can deactivate accounts for abuse.
Platform Analytics
Total registered users, total clinics, total bookings this month, total revenue processed, top 10 cities by bookings, new user growth chart, booking growth chart.

PART 23 — NOTIFICATIONS SYSTEM
Frontend
The bell icon in the top bar shows a red badge with a number if there are unread notifications. When tapped, opens a notifications panel that slides in from the right (like a drawer) or navigates to a notifications page.
The notifications list shows each notification as a card. The card has an icon on the left (blue calendar for booking confirmed, red calendar for cancelled, star for new review, green check for appointment completed), a title, body text, and a relative time like "2 minutes ago". Unread notifications have a blue dot on the left and a slightly different background. Tapping a notification marks it as read and navigates to the relevant page.
"Mark all as read" button at the top.
Backend
When any important event happens, a function called createNotification is called. It creates a Notification document in MongoDB. It also emits a Socket.io event to the specific user's room. On the frontend, a Socket.io client is connected when the user is logged in. When a notification event is received, the bell badge count increments and a toast pops up.

PART 24 — DARK MODE AND THEME SYSTEM
Color System
Define CSS variables in your index.css for all colors. In light mode: --bg-primary is white, --bg-secondary is zinc-50, --bg-card is white, --text-primary is zinc-900, --text-secondary is zinc-500, --border is zinc-200, --accent is #0EA5E9 (sky blue), --accent-dark is #0284C7.
In dark mode (inside .dark class): --bg-primary is zinc-950, --bg-secondary is zinc-900, --bg-card is zinc-900, --text-primary is zinc-100, --text-secondary is zinc-400, --border is zinc-800. Accent stays the same.
Every component uses these CSS variables or their Tailwind equivalents like bg-white dark:bg-zinc-900. This ensures perfect dark mode everywhere.
Theme Toggle
The toggle button in the top bar shows a sun icon in light mode and a moon icon in dark mode. When toggled, Framer Motion does a flip animation: the icon rotates 180 degrees and swaps. The theme change is instant with no flash or delay.
System Preference
In App.jsx, on first load if no theme is saved in localStorage, check window.matchMedia('(prefers-color-scheme: dark)').matches. Also add a listener for change on that media query so if the user switches their phone to dark mode while the app is open, the app theme updates automatically.

PART 25 — MULTILINGUAL SUPPORT
Translation Files
Create four JSON files. en.json, hi.json, mr.json, gu.json. Every string in the app has a key. For example "home.greeting.morning" is "Good morning" in English and "शुभ प्रभात" in Hindi.
Use descriptive nested keys: auth.login.title, auth.login.phoneLabel, auth.login.sendOtp, home.nearby.title, search.filters.specialty, etc.
Translating Dynamic Strings
For strings with variables use i18next's interpolation: "booking.confirmation" is "Your appointment with {{doctorName}} on {{date}} is confirmed". Call it as t('booking.confirmation', { doctorName: 'Dr. Sharma', date: 'Monday' }).
Language Switcher
In the profile settings page, tapping Language opens a bottom sheet with four options each showing a flag, language name in that language, and a checkmark if selected. Changing language immediately updates all text without page refresh.
RTL Support
None of the four languages are RTL, so no RTL layout changes are needed. But structure your CSS to not hard-code left and right — use start and end logical properties so future RTL languages can be supported by just adding a dir="rtl" attribute.

PART 26 — PREMIUM UI DETAILS
These small things are what make the app feel premium instead of generic.
Skeleton loading states. Every screen that loads data shows animated skeleton placeholders in the exact shape of the real content. The home page shows skeleton cards in the same dimensions as real cards. The doctor profile shows a skeleton circle where the photo goes. Never show a spinner in the center of the page.
Pull-to-refresh indicator. When the user pulls down from the top of any scrollable page, show a thin teal progress bar at the very top of the container. When React Query's isFetching is true, show a 3px tall teal bar at the top that animates from left to right.
Toast notifications. Use react-hot-toast. Configure it to appear at the top center. Success toasts have a teal check icon. Error toasts have a red X. All toasts have rounded corners and a subtle shadow. Auto-dismiss after 3 seconds.
Haptic feedback simulation. When a user taps any important button (Book, Confirm, etc.), use a tiny scale animation — scale to 0.97 and back to 1 in 100ms. This simulates the physical feel of pressing a button.
Empty state illustrations. Every empty state has a small SVG illustration relevant to the context. These should be simple line-art style in your accent color. For empty bookings: a calendar with a plus. For no search results: a magnifying glass with a question mark. For no notifications: a bell with a zzz.
Loading shimmer effect. The skeleton placeholders use a shimmer animation: a gradient that sweeps from left to right repeatedly. Implement this with a CSS keyframe animation using a linear gradient moving via background-position.
Micro-animations. The star rating component fills in one star at a time with a small bounce when a review card loads. The booking status badge pulses gently if status is Pending. The bottom navigation active indicator slides smoothly between tabs. The notification badge bounces once when the count increments.
Photo optimization. All images use loading="lazy" attribute. All images from Cloudinary use URL transformations to serve the right size (thumbnail for list views, medium for cards, full for detail pages). Add a blurred placeholder while the full image loads using CSS filter blur transitioning to 0.

PART 27 — PROGRESSIVE WEB APP SETUP
Create a manifest.json file in the public folder. Set name to "ClinicBook", short_name to "ClinicBook", theme_color to your accent teal, background_color to white, display to "standalone", orientation to "portrait". Add icons in sizes 192x192 and 512x512.
Add <link rel="manifest" href="/manifest.json"> and <meta name="theme-color" content="#0EA5E9"> to your index.html.
This allows users on Android Chrome to add the app to their home screen and it opens like a real app without browser chrome.

PART 28 — DEPLOYMENT GUIDE
Frontend to Vercel
Push your code to GitHub. Go to vercel.com, connect your GitHub. Import the client folder. Set build command to npm run build, output directory to dist. Add environment variables VITE_API_URL and VITE_GOOGLE_MAPS_API_KEY. Deploy. Vercel gives you a free .vercel.app URL.
Backend to Railway
Go to railway.app. Create a new project. Connect GitHub, select the server folder. Add all environment variables. Railway auto-detects Node.js and runs npm start. Your backend gets a public URL. Update FRONTEND_URL in backend env to your Vercel URL.
MongoDB Atlas
Create a free cluster on mongodb.com/atlas. In network access, add your Railway IP or allow all (0.0.0.0/0). In database access, create a user. Get your connection string and put it in MONGODB_URI environment variable.
Twilio WhatsApp Setup
Go to Twilio console. Activate the WhatsApp sandbox. Set the webhook URL to https://your-railway-url.up.railway.app/api/webhook/whatsapp. Test by sending "join [sandbox-word]" to the sandbox number from your WhatsApp.
After Deployment Checklist
Update CORS in Express to use exact Vercel URL. Test every flow end to end on mobile browser. Test OTP flow. Test WhatsApp bot. Test clinic owner registration and login. Test super admin approval. Test map search. Test slot booking. Test dark mode. Test language switching. Check that all environment variables are set correctly in both Vercel and Railway.

PART 29 — BUILD ORDER (EXACT SEQUENCE)
Follow this exact order. Never skip ahead.
First week: Set up the two folders. Install all packages. Write all Mongoose models. Connect to MongoDB Atlas. Seed fake data for 3 clinics and 6 doctors with realistic information. Test that data is saved and readable.
Second week: Build the entire authentication system. Patient OTP login. Clinic owner registration and login. JWT generation and refresh. Test every auth route with Postman until every case works.
Third week: Build the clinics nearby API. Build the slot availability logic and test it with edge cases (holidays, break times, past times). Build the booking creation API with transaction logic. Test everything with Postman.
Fourth week: Start the React app. Set up routing, layouts, Zustand store, React Query, i18next. Build the patient login flow completely. It should work end to end on your phone browser.
Fifth week: Build the home page. Build the search page with map and list views. Connect to real backend. Make sure location permission works.
Sixth week: Build clinic detail page. Build doctor profile page with date picker and slot selection. Build booking confirmation page and success page.
Seventh week: Build my bookings page. Build patient profile and settings page. Build notifications system with Socket.io.
Eighth week: Build the clinic owner dashboard. Registration flow. Clinic management. Doctor management. Appointment management.
Ninth week: Build the WhatsApp bot. Test every state transition.
Tenth week: Build super admin panel. Add dark mode to every component. Add all animations and micro-interactions.
Eleventh week: Fix all bugs found during testing. Optimize loading. Add PWA manifest. Check mobile responsiveness on multiple screen sizes.
Twelfth week: Deploy. Test everything on production. Set up Twilio production WhatsApp. Final polish.

This is the complete, fully detailed specification for every part of the platform. Every screen, every API, every database field, every user flow, every animation, and every logic is described. Follow each part in order and you will have a production-ready premium doctor booking platform.You said: add more features make it like 1 bilane app like profeesional have all fearues that require and more give me in simple text format like start with PART 27 like…add more features make it like 1 bilane app like profeesional have all fearues that require and more give me in simple text format like start with PART 27 like implate all features in detailed have00:05Claude responded: Doctor Clinic Booking Platform — Billion Dollar UpgradeDoctor Clinic Booking Platform — Billion Dollar Upgrade
Every Feature, Every Detail, Starting from PART 27

PART 27 — ADVANCED SEARCH AND DISCOVERY ENGINE
The search system needs to feel like Google mixed with Zomato. When a user opens the search page, it should feel intelligent, fast, and personalized.
Smart Search with Typo Tolerance
Your search backend uses MongoDB's text indexes but you layer intelligence on top. When a user types "cardilogist" (with a typo), the system still finds cardiologists. Implement this by using a fuzzy matching approach: create a utility that generates phonetic variations of the search term. Also use MongoDB Atlas Search if you upgrade to a paid tier, which gives you Lucene-based full-text search with built-in fuzzy matching, autocomplete, and relevance scoring out of the box.
The autocomplete endpoint at /api/search/autocomplete queries three collections simultaneously using Promise.all: Doctors (matching on name and specialization), Clinics (matching on name and specializations), and a hardcoded list of specialty names. It returns a merged array limited to 8 results, sorted by relevance score. Each result has a type field so the frontend can show different icons.
Search History
Store the last 10 searches per user in localStorage on the frontend. When the search bar is focused and empty, show a "Recent Searches" section with a clock icon before each item. Each item has an X button to remove it. This is pure frontend logic, no backend needed.
Trending Searches
The backend has an endpoint /api/search/trending that returns the top 10 most searched terms in the last 7 days. Track searches by incrementing a counter in a SearchAnalytics collection whenever a search is executed. On the search page, below Recent Searches, show a "Trending" section with a fire emoji and the trending terms as chips.
Voice Search
When the user taps the microphone icon in the search bar, use the browser's Web Speech API: new window.SpeechRecognition(). Start listening and show an animated waveform SVG while listening. When the user stops speaking, the recognized text fills the search bar and auto-searches. Show a "Listening..." label and a cancel button. This works on Chrome on Android natively.
Advanced Filters (Detailed)
Beyond the basic filters, add these additional filter options in the filter bottom sheet. Insurance Accepted: show checkboxes for common insurance providers. Video Consultation Available: a toggle (this requires adding a offersVideoConsult field to the Doctor model). Available Today Only: a toggle that filters to doctors with open slots today. Female Doctor Only: a toggle. Years of Experience minimum: a slider from 0 to 30 years. Consultation Fee range: a dual-handle slider for minimum and maximum fee. Verified Only: a toggle showing only platform-verified doctors.
All filters are applied client-side on the already-fetched result set for speed, with a debounced API call when the result set would change significantly.
Search Results Personalization
Track which specialties a patient searches for most. Store this in the User document as a searchHistory array with specialty, count, and lastSearched. The recommendations on the home page use this data. The search results also rank doctors that match the patient's most-searched specialties higher.

PART 28 — VIDEO CONSULTATION FEATURE
This is a massive differentiator. Patients can book video calls with doctors who offer online consultations.
Doctor Model Update
Add these fields to Doctors: offersVideoConsult (boolean), videoConsultFee (number, usually lower than in-person), videoConsultDuration (number in minutes, typically 10 or 15).
Appointment Model Update
Add consultationType field: enum of inPerson or video. Add videoRoomId (string, the unique room identifier). Add videoRoomToken (string, the patient's access token for the room). Add videoStartedAt and videoEndedAt timestamps.
Video Infrastructure
Use Daily.co's free tier (up to 2000 participant-minutes free per month) or 100ms. Both offer React SDKs. Create a utility function createVideoRoom that calls the Daily.co API to create a unique room with a name based on the booking ID. The room is set to expire 2 hours after the appointment time so unused rooms clean themselves up.
Booking Flow for Video
When a patient selects a doctor who offers video consultation, show a choice on the booking page: "In-Person Visit ₹500" or "Video Consultation ₹300" as two large selectable cards with icons. Selecting video shows a note: "You will receive a video link 10 minutes before your appointment."
10 Minutes Before Appointment
A node-cron job runs every minute checking for video appointments starting in 10 minutes. For each found, call Daily.co API to create the room, store the room ID in the appointment, generate a patient token and a doctor token, send a push notification to the patient saying "Your video call with Dr. Sharma starts in 10 minutes. Tap to join." with a deep link to the video page in the app.
Video Call Page
URL is /appointments/:id/video. When this page loads, check that the appointment is within 15 minutes of now or already started. If too early, show a countdown timer. If on time, initialize the Daily.co React SDK. Show the doctor's video on a large card filling most of the screen, patient's own camera in a small picture-in-picture in the corner. Bottom controls: mute microphone, turn camera on or off, end call. End call navigates to a post-call rating screen.
Video Call for Doctor (Clinic Owner)
In the clinic owner dashboard, upcoming video appointments have a "Join Video Call" button that becomes active 5 minutes before the appointment time.

PART 29 — PAYMENT GATEWAY INTEGRATION
Handling payments makes this a real commercial product.
Razorpay Integration
Razorpay is the best payment gateway for India. Install npm install razorpay on the backend. Create a Razorpay instance with your key ID and secret from .env.
Payment Flow
When patient confirms booking, if the clinic requires upfront payment (a setting in the Clinic model called requiresUpfrontPayment), show a payment step before the confirmation step.
The booking flow for paid clinics: Patient taps Confirm → Backend creates an order via Razorpay API (POST to Razorpay's /v1/orders) → Returns Razorpay order ID to frontend → Frontend opens Razorpay checkout modal (using the Razorpay JS SDK loaded in index.html) → Patient pays via UPI, card, netbanking, or wallet → Razorpay sends a webhook to your backend at /api/webhook/razorpay confirming payment → Backend verifies the payment signature using crypto's HMAC SHA256 → Backend creates the appointment with paymentStatus as paid → Patient sees success screen.
Refund on Cancellation
When an appointment with a paid booking is cancelled more than 2 hours in advance, automatically initiate a refund via Razorpay's refunds API. Store the Razorpay payment ID in the Appointment model. Call razorpay.payments.refund(paymentId, { amount: fullAmount }). Update the appointment's paymentStatus to refunded. Send a WhatsApp message to the patient: "Refund of ₹500 has been initiated. It will reach your account in 5-7 business days."
Clinic Owner Payouts
Track clinic earnings in a Payouts collection. Each time a payment is received, create a payout record linking to the appointment. On the clinic dashboard analytics page, show total earned, amount pending payout, and payout history. Manual bank transfer payouts can be done by you (super admin) initially, or integrate Razorpay Routes for automated splits.
Wallet Feature
Add a walletBalance field to the User model. Patients can add money to their in-app wallet using Razorpay. When booking, they can pay from wallet for instant confirmation with no redirect. Top up the wallet in denominations of ₹200, ₹500, ₹1000. Show wallet balance on the profile page with a transaction history.

PART 30 — PRESCRIPTION AND MEDICAL RECORDS
After a completed appointment, the doctor can upload a prescription and the patient can view it. This makes the platform a complete healthcare record system.
Doctor Adding Prescription
In the clinic owner dashboard, for completed appointments, show an "Add Prescription" button. Clicking opens a modal with two options: upload a PDF or image, or create a digital prescription using a form.
The digital prescription form has fields: Chief Complaint (what the patient complained about), Diagnosis, Medicines (add multiple rows each with medicine name, dosage like 500mg, frequency like twice a day, duration like 7 days), Lab Tests Recommended (text area), Follow Up Date (date picker), Doctor's Notes.
When saved, this data is stored in a Prescriptions collection and a PDF is auto-generated using pdfkit on the backend. The PDF is uploaded to Cloudinary and the URL is stored in the Appointment document.
Patient Viewing Prescriptions
In the appointment detail page, show a "View Prescription" button if one exists. Tapping opens the PDF in an in-app viewer using an iframe or opens the Cloudinary PDF URL in a new tab. The patient can also download it.
Medical Records Section
Add a "Health Records" section to the patient profile page. Shows all prescriptions from all past appointments in chronological order. The patient can also manually upload their own records (old prescriptions, lab reports, etc.) to their own private health vault on Cloudinary. Each uploaded record has a type (Prescription, Lab Report, Scan, Vaccination, Other), a date, and a note.
Add a healthRecords array to the User model where each item has: url, type, date, note, uploadedBy (self or clinic).

PART 31 — FAMILY MEMBER PROFILES
One phone number should be able to manage bookings for the whole family.
Family Members Model
Add a familyMembers array to the User model. Each family member has: _id (UUID), name, relationship (Self, Spouse, Child, Parent, Other), dateOfBirth, gender, bloodGroup, photo (optional). There is no login for family members, they are managed entirely under the primary user's account.
Adding Family Members
In the patient profile page, add a "Family Members" section. Show existing members as cards with photo (or initials), name, relationship, age. Add button to add a new member. Maximum 5 family members per account.
Booking for Family Member
In the booking page, add a "Who is this for?" section at the top. Show the patient themselves as the first option and all their family members below. Tapping a family member selects them as the patient for this booking. The appointment is stored with both accountOwnerId (the logged-in user) and patientName, patientAge, patientGender from the selected family member. The account owner receives all notifications.

PART 32 — DOCTOR RATING AND REVIEW SYSTEM (ADVANCED)
The basic review system was covered earlier. Here is the advanced version.
Verified Reviews Only
Only patients with a completed appointment can leave a review for that specific doctor. The POST /api/reviews route checks that the appointment exists, belongs to the logged-in user, has status completed, and does not already have a review.
Multi-Dimensional Rating
Patients rate four dimensions: Overall Experience (1-5), Doctor's Consultation Quality (1-5), Wait Time (1-5), Facility Cleanliness (1-5). Each dimension is stored separately. On the doctor profile page, show a breakdown: four horizontal progress bars showing the average of each dimension.
Review Moderation
When a review is submitted, run it through a basic profanity filter (a list of blocked words stored in a constant). If it passes, set isVisible to true immediately. If it contains blocked words, set isVisible to false and flag it for manual review. Super admin sees flagged reviews in their panel.
Helpful Votes
Other patients can tap a "👍 Helpful (X)" button on any review. This calls a backend route that increments helpfulCount on the review and stores the user's ID in a helpfulVoters array (so they can only vote once). Reviews are sorted by helpfulCount descending after the most recent ones.
Photo Reviews
Allow patients to upload up to 3 photos with their review. These photos show in the reviews section as small thumbnails. Tapping a thumbnail opens a full-screen lightbox. This is extremely useful for clinic review photos.

PART 33 — SMART REMINDERS AND NOTIFICATIONS
Multi-Channel Reminders
For every confirmed appointment, set up three reminders: 24 hours before via WhatsApp and push notification, 1 hour before via WhatsApp and push notification, 15 minutes before via push notification only. Each reminder message is personalized with the doctor's name, clinic address, and the advice to arrive 10 minutes early.
Push Notifications (FCM)
Firebase Cloud Messaging gives free push notifications. Install firebase-admin on the backend. Add the FCM credentials JSON to your environment variables. When a user opens the app and grants notification permission, call messaging().getToken() from the Firebase JS SDK on the frontend and send that token to your backend: PATCH /api/patient/profile with fcmToken. Store it in the User model.
Create a utility function sendPushNotification(fcmToken, title, body, data) on the backend that uses firebase-admin to send to that token. Call this function whenever you need to notify a patient. Also add fcmToken to the ClinicOwner model so clinic owners get notified of new bookings.
In-App Notification Bell
Already covered in PART 23 but with these additions: group notifications by day (Today, Yesterday, This Week, Earlier). Add swipe-to-dismiss on each notification card using Framer Motion's drag gesture. Dismissed notifications still exist in the database, they are just hidden from the list.
Email Notifications
For clinic owners and patients with verified emails, also send email notifications using Nodemailer for booking confirmations. Create beautiful HTML email templates for: Booking Confirmed (shows all details in a table, clinic directions link, cancel link), Appointment Reminder, Booking Cancelled, Review Request After Completion. Store email templates in an emailTemplates folder on the backend as HTML strings with template variables replaced using simple string interpolation.

PART 34 — SMART APPOINTMENT MANAGEMENT
Auto-Confirm Logic
Add a field autoConfirm to the Clinic model, defaulting to true. If autoConfirm is true, appointments are automatically set to confirmed status when created, and the patient is immediately notified. If false, appointments start as pending and the clinic owner must manually confirm them. This setting is in the clinic settings page.
Waitlist Feature
When all slots for a doctor are booked on a particular date, show a "Join Waitlist" button instead of a "No slots available" message. Joining the waitlist creates a Waitlist entry in a new Waitlist collection with: patientId, doctorId, clinicId, preferredDate, preferredTimeRange (morning, afternoon, evening), position (calculated from when they joined). If a booked patient cancels, a cron job finds the first waitlisted patient and sends them a WhatsApp and push notification: "A slot opened up with Dr. Sharma on January 16! Tap here to book within 30 minutes." Store a waitlistOfferExpiresAt timestamp. If the waitlisted patient does not book within 30 minutes, offer it to the next person in line.
Recurring Appointments
For patients who need regular checkups (monthly blood pressure check, weekly physiotherapy), add a "Make Recurring" option in the booking flow. Options: every week, every 2 weeks, every month. This creates multiple appointment documents at once for the next 3 months. All can be cancelled individually. Show recurring appointments with a repeat icon in the bookings list.
Check-In Feature
On the day of appointment, when the patient opens the appointment detail page, show a "Check In" button that becomes active 30 minutes before the appointment time. When the patient taps Check In, the appointment status changes to checkedIn, and the clinic's real-time dashboard shows a live indicator that this patient has arrived. The patient also sees a digital token number: "You are patient number 3 in queue."
Queue Management
Each clinic has a live queue. The clinic dashboard shows a queue view: a column of arriving patients in order, each with their name and check-in time. The clinic can mark patients as "Called In" and "Completed" one by one. Each marking updates the queue order for all waiting patients. Patients waiting see a WhatsApp update every 15 minutes: "There are 2 patients before you. Estimated wait: 10 minutes."

PART 35 — HEALTH PROFILE AND SYMPTOM CHECKER
Detailed Health Profile
Add a healthProfile field to the User model containing: height (cm), weight (kg), bloodGroup, allergies (array of strings), chronicConditions (array), currentMedications (array), emergencyContact (object with name, phone, relationship).
In the patient profile page, add a "Health Profile" card. When filled, this information can optionally be shared with the doctor when booking — a toggle on the booking page: "Share my health profile with Dr. Sharma (name, blood group, allergies, current medications)." If shared, this data is attached to the appointment and visible to the clinic.
BMI Calculator
On the health profile page, if height and weight are filled, automatically calculate and display BMI with a visual gauge showing Underweight, Normal, Overweight, Obese categories with color coding.
Symptom Checker
Add a "Check Symptoms" feature accessible from the home page. This is a simple decision tree (not AI, just structured questions). The user selects a body area (Head, Chest, Stomach, Skin, etc.), then selects specific symptoms from a list. The logic maps symptom combinations to recommended specialties. For example, chest pain plus shortness of breath recommends Cardiology urgently. Fever plus rash recommends Dermatology. The result shows the recommended specialty with a "Find Doctors" button that pre-fills the specialty filter in search. Add a disclaimer: "This is for guidance only and not a medical diagnosis."

PART 36 — CLINIC OWNER ADVANCED FEATURES
Multiple Clinics Under One Account
One clinic owner account can manage multiple clinic branches. All features work across all their clinics. The dashboard has a clinic selector at the top to switch between clinics or view aggregate data across all.
Doctor Schedule Management (Detailed)
Each doctor has a highly granular schedule. The schedule management page shows a weekly calendar view (Sunday to Saturday). Each day block shows the doctor's working hours as a colored bar. The owner can drag the bar edges to change start and end times. Click a day to add a break slot. Click a date to mark it as holiday. Click a date range to mark as leave. The calendar shows actual booked appointments as lighter blocks within the working hours so the owner can see how full each day is.
Slot Configuration Per Day
Different days can have different configurations. Monday might have 15-minute slots from 9 AM to 2 PM. Saturday might have 30-minute slots from 10 AM to 1 PM. Configure this per day in the schedule editor.
Appointment Notes and History
In the appointment management page, the clinic owner can add private notes to any appointment (not visible to the patient). These notes are stored in the clinicNotes field. On future bookings from the same patient, these past notes are shown to the clinic as context.
Broadcast Message
A "Broadcast" feature in the clinic dashboard. The owner selects all patients who have visited their clinic (or a specific doctor), writes a message like "Dr. Sharma is taking leave on January 20. Please reschedule your appointments." and sends it as WhatsApp messages and push notifications to all selected patients. Rate-limited to prevent spam: maximum one broadcast per week per clinic.
Custom Clinic URL
Each clinic gets a shareable URL like yourclinicbook.com/clinic/city-care-clinic. The slug was generated when creating the clinic. The clinic can share this URL on their social media, business cards, and Google My Business. This URL shows the clinic's full profile publicly without requiring login.

PART 37 — MAPS AND LOCATION FEATURES (ADVANCED)
Directions Integration
The "Get Directions" button on every clinic card and detail page opens Google Maps (on Android and desktop) or Apple Maps (on iOS, detected via user agent). Pass the clinic's coordinates so the maps app shows turn-by-turn directions from the user's current location.
Distance and Travel Time
For every clinic in the search results, show not just distance in kilometers but also estimated travel time. Use Google Maps Distance Matrix API which takes the user's coordinates and the clinic's coordinates and returns driving time and walking time. Call this API for the top 10 results. Show "12 min by car · 3.2 km" under each clinic card.
Nearby Landmarks
When a patient books an appointment, the confirmation message and WhatsApp message include a "How to reach" section: "City Care Clinic is located near [nearest landmark from the clinic's address field]." Store a landmark field in the clinic address.
Map Clustering
When showing many clinics on the Google Map, use marker clustering: if multiple clinics are close together, show a single circle with a number indicating how many clinics are there. Zooming in splits the cluster into individual markers. Use the @googlemaps/markerclusterer library.
Heat Map of Clinics
In the super admin analytics page, show a Google Maps heat map layer showing the density of clinics across cities. This helps identify underserved areas.

PART 38 — CONTENT AND BLOG SECTION
A health blog makes the platform a resource, not just a booking tool. This dramatically helps SEO and brings organic traffic.
Articles Collection
Create an Articles collection with: title, slug, coverImage, content (rich text stored as HTML), author (object with name and photo), category (string, like Heart Health, Skin Care, Child Health), tags (array), readTime (calculated from content length), views, isPublished, publishedAt.
Blog Pages
Add a "Health Guide" section in the patient app bottom nav (make it a 5th item and redesign to have icons only, no labels, or use a swipeable bottom nav). The blog page shows articles in a card grid. Each card shows the cover image, category tag, title, read time, and date. Tapping opens the full article in a clean reading view with the cover image at the top, a progress bar showing how much of the article has been read, and a share button.
At the end of every article, show "Book a Consultation" cards with 2-3 relevant doctors matching the article's category.
Super Admin Article Editor
In the admin panel, a rich text editor (use a library like TipTap or Quill) for writing articles. Upload cover image, fill metadata, preview, publish. The editor supports headings, bold, italic, bullet lists, images within content, and embedded YouTube videos.

PART 39 — LOYALTY AND REWARDS SYSTEM
Gamification increases retention dramatically.
ClinicCash Points
Every booking earns points. 1 rupee spent equals 1 ClinicCash point. First booking earns a welcome bonus of 100 points. Writing a review earns 50 points. Referring a friend earns 200 points. Points are stored in the User model as clinicCashBalance and a pointsHistory array.
Referral System
Every patient has a unique referral code (generated from their name and a random 4-digit number, stored in the User model as referralCode). Add a "Refer and Earn" page in the profile section. Shows the code and a share button that pre-fills a WhatsApp message: "Join ClinicBook and book your first doctor appointment! Use my code RAHUL4523 and get ₹100 in your wallet. Download: [link]".
When a new user enters a referral code on the profile completion page (optional field), the backend finds the referrer by code and adds 200 points to their account. The new user gets 100 ClinicCash points as a welcome bonus.
Redeeming Points
On the booking payment page, if the patient has more than 100 ClinicCash points, show a toggle "Use ClinicCash (X points = ₹Y off)". The exchange rate is 1 point equals 0.5 rupees. Maximum 50% of the booking fee can be paid with ClinicCash.
Membership Tiers
Four tiers based on total lifetime bookings: Bronze (0-4 bookings), Silver (5-19), Gold (20-49), Platinum (50+). Each tier has a badge shown on the patient profile. Higher tiers get small perks: Silver gets 2x points on bookings, Gold gets 3x, Platinum gets priority customer support and early access to new features.

PART 40 — IN-APP CHAT
A chat between patient and clinic (not doctor, for privacy and liability reasons) for pre-appointment queries.
Chat Collection
Create a Chats collection with: participantOne (patient ID), participantTwo (clinic owner ID), clinicId, messages (array of message objects each with senderId, senderType, text, timestamp, isRead). lastMessage (string for preview). lastMessageAt (date for sorting).
Chat in Patient App
In the clinic detail page, add a "Message Clinic" button. This opens a chat screen. The chat screen shows messages in a bubble layout (patient's messages right-aligned in teal, clinic's messages left-aligned in gray). An input at the bottom with send button. Messages delivered via Socket.io for real time — no page refresh needed.
Chat in Clinic Dashboard
A "Messages" item in the clinic owner sidebar. Shows a list of patient conversations with the patient name, last message preview, and unread count badge. Clicking opens the conversation.
Chat Limitations
Clearly state in the UI: "This chat is for appointment-related queries only. For medical advice, please book a consultation." Maximum 50 messages per conversation. No photos (for simplicity and safety). Auto-close conversation after 7 days of inactivity.

PART 41 — EMERGENCY AND URGENT CARE FEATURES
Urgent Booking Mode
Add an "Urgent" option when booking. The patient can tap "I need urgent care" from the home page. This opens a streamlined flow: select the type of emergency (Fever, Severe Pain, Breathing Difficulty, Injury, etc.), and the system searches for clinics that are open right now, within 3km, with available slots in the next 2 hours. Results are sorted by nearest and most immediately available.
SOS Button
Add a subtle SOS button on the profile page in the emergency contact section. When held for 3 seconds (to prevent accidental taps), it uses the Web Share API or SMS to send the patient's current location and name to their emergency contact. Show a countdown animation during the 3-second hold so the user can cancel.
24/7 Clinic Badge
Clinics that are open 24 hours have a "24/7 Open" badge in search results. This is automatically determined by reading their opening hours from the database.
Ambulance Quick Dial
Add a "🚑 Call 108" quick button in the urgent care section. This directly calls the Indian national ambulance number. No backend needed, just an href="tel:108" link styled as a red button.

PART 42 — TELEMEDICINE MARKETPLACE
Beyond video consultation with clinic doctors, add a separate marketplace for quick tele-consultations with freelance doctors.
Instant Consult Section
On the home page, add a section "Talk to a Doctor Now — No Appointment Needed". This shows doctors who are currently online and available for immediate video calls. Each doctor card shows a green "Online Now" indicator, their specialty, and a "Consult ₹99" button.
Doctor Online Status
Add isOnlineForInstantConsult (boolean) and instantConsultFee to the Doctor model. When a doctor wants to offer instant consultations, they flip a toggle in their dashboard and appear in the instant consult pool. Use Socket.io to track their real-time online status.
Instant Consult Booking
Patient taps Consult, pays immediately via Razorpay, and a video room is created instantly. The doctor receives a push notification and Socket.io event on their doctor app (a separate view for doctors marked as freelance). The doctor has 60 seconds to accept. If not accepted, full refund and show next available doctor.

PART 43 — AI-POWERED FEATURES
These features use the Anthropic Claude API (or OpenAI) to add intelligence.
AI Health Assistant Chat
Add an "Ask AI" button accessible from the home page. This opens a chat interface where patients can ask health questions in any language. The backend proxies requests to the Claude API with a system prompt: "You are a helpful health assistant. Provide general health information only. Always recommend consulting a doctor for medical advice. Never diagnose conditions. Respond in the same language the user writes in." Store the conversation in session storage (not permanently). At the end of every conversation, show a "Book a Consultation" prompt with relevant doctor recommendations.
Smart Doctor Matching
When a patient describes their problem in the search bar in natural language ("my knee has been hurting for 3 weeks after running"), use the Claude API to extract the likely specialty (Orthopedic) and relevant information, then show matching doctors. The backend endpoint /api/search/ai-match sends the query to Claude with a system prompt asking it to return the relevant specialty and urgency level in JSON format.
Review Summary
For clinics with more than 20 reviews, add an "AI Summary" card at the top of the reviews section. The backend periodically (once a day via cron) sends the last 50 reviews for popular clinics to Claude with the prompt "Summarize these patient reviews in 3 bullet points: what patients love, what could be improved, overall sentiment." Store this summary in the Clinic document as reviewSummary. Show it in a styled card with a sparkle icon.
Appointment Prep Tips
One day before an appointment, in addition to the reminder notification, send a personalized message generated by Claude: "Your appointment with Dr. Sharma (Cardiologist) is tomorrow. Here are some tips to prepare: fast for 4 hours before if it is your first visit, bring your previous ECG reports if you have them, note down your symptoms and when they started." The system prompt to Claude includes the doctor's specialty so Claude gives relevant preparation tips.

PART 44 — SOCIAL FEATURES
Healthcare has a social dimension: people ask friends for doctor recommendations.
Share Doctor Profile
Every doctor profile has a share button. Tapping it uses the Web Share API to share a link like clinicbook.com/doctors/dr-priya-sharma-cardiologist. The link opens the doctor's public profile page which works without login (read-only view). This page has proper Open Graph meta tags so the link preview on WhatsApp and Instagram shows the doctor's photo, name, specialty, and rating.
Friend Referral for Doctor
When a patient has visited a doctor, they see a "Recommend to a Friend" option on that doctor's card in their completed bookings. This opens a shareable card with the doctor's name, rating, and a personal note: "Rahul recommends Dr. Priya Sharma. Book via this link for ₹50 off your first visit." The referral link includes a referral tracking parameter.
Public Review Profiles
Patient reviews are publicly visible on doctor and clinic pages without login (but patient names are anonymized to first name and last initial for privacy, like "Rahul M."). This means doctor profile pages can rank in Google search results.

PART 45 — CLINIC ANALYTICS (VERY DETAILED)
The clinic owner analytics page is their most used feature after appointments.
Revenue Dashboard
Total revenue this month with a comparison to last month shown as a percentage change with an up or down arrow. Revenue by doctor shown as a horizontal bar chart. Revenue by day of week shown as a bar chart (clinic owners discover their busiest days). Revenue trend over last 12 months as a line chart. All charts use Recharts with smooth animations.
Patient Insights
Total unique patients this month. New patients versus returning patients as a donut chart. Patient retention rate: what percentage of first-time patients came back. Age distribution of patients as a bar chart (groups: under 18, 18-30, 31-45, 46-60, above 60). Gender distribution. City-wise distribution if the clinic draws from multiple areas.
Doctor Performance
Each doctor shown as a row with their bookings count, completion rate (completed divided by confirmed), average rating, revenue generated, cancellation rate, no-show rate. Clicking a doctor shows their detailed metrics.
Time Slot Analysis
Heat map grid showing booking density by hour and day of week. The clinic owner sees immediately which slots are always full and which are always empty. They can use this to adjust their slot configuration.
Cancellation and No-Show Analysis
Cancellation rate over time. Most common cancellation reasons (from the cancellationReason field). No-show rate and estimated revenue lost from no-shows. This motivates clinics to use the reminder system.
CSV and PDF Export
Add "Export" buttons to every analytics section. Clicking Export CSV downloads the underlying data as a CSV file. Export PDF generates a formatted report using pdfkit on the backend, with the clinic logo, date range, and all charts as images.

PART 46 — SUPER ADMIN ADVANCED FEATURES
Platform Revenue Tracking
The super admin sees the total platform commission earned (if you charge clinics a percentage per booking). Track this in a Commissions collection.
Clinic Verification Workflow
Three levels of verification. Level 1: Email verified. Level 2: Documents checked (you manually review uploaded license). Level 3: Physical verification (a field agent visits the clinic). Each level shows a different badge on the clinic profile. Higher verification levels rank higher in search results.
Dispute Resolution
When a patient disputes a booking (wrong diagnosis, rude behavior, clinic refused the appointment), they can file a dispute from the appointment detail page. A Disputes collection stores the dispute with the patient's complaint, the clinic's response, status (open, investigating, resolved), and resolution. The admin panel has a Disputes tab where you handle these.
Platform Settings
A settings page in admin for: commission percentage, maximum advance booking days, OTP expiry time, session expiry time, WhatsApp bot message templates (so you can update them without code changes), featured clinic position management, and announcement banners (text that shows as a banner at the top of the patient app for announcements like holidays or new features).

PART 47 — PERFORMANCE AND OFFLINE SUPPORT
Service Worker and Offline Mode
Register a service worker in your React app using Vite's PWA plugin. The service worker caches the app shell (HTML, CSS, JS, fonts) so the app loads instantly even on slow connections. It also caches API responses for the home page and last-viewed clinic for offline viewing. When offline, show a thin orange banner "You are offline. Some features may not be available." but the user can still view cached content.
API Response Caching Strategy
Use React Query's stale time configuration thoughtfully. Doctor availability slots have a stale time of 30 seconds (changes frequently). Doctor profile has a stale time of 5 minutes. Clinic details have a stale time of 10 minutes. Home page clinics have a stale time of 1 minute. User profile has a stale time of 5 minutes.
Image Lazy Loading and Optimization
All clinic and doctor photos are served from Cloudinary. Add transformation parameters to every Cloudinary URL. For thumbnails in list views, add w_200,h_200,c_fill,q_auto,f_auto to crop and compress. For full-width images, add w_800,q_auto,f_auto. The f_auto makes Cloudinary serve WebP to browsers that support it (most do) which is 30% smaller than JPEG. Use the IntersectionObserver API to only load images when they are about to scroll into view.
Database Query Optimization
Add the following indexes beyond what was listed in PART 3. On Appointments: index on patientId for fetching patient bookings, index on clinicId and appointmentDate for clinic dashboard queries. On WhatsappSessions: index on lastActivityAt for the expiry cron job. On Notifications: compound index on userId and isRead for fetching unread count. Run MongoDB's explain() on your most common queries to verify they are using indexes.
Rate Limiting Per Route
Use express-rate-limit with different limits per route type. OTP sending: maximum 3 requests per phone per hour. Search: maximum 60 requests per IP per minute. Booking creation: maximum 10 per user per hour. Admin routes: maximum 100 per admin per minute. WhatsApp webhook: unlimited (Twilio needs to post freely).

PART 48 — SECURITY HARDENING
Input Validation
Every route that accepts data uses express-validator middleware. Validate types, lengths, formats. Sanitize all string inputs to prevent XSS. Use the mongoSanitize middleware to prevent NoSQL injection.
JWT Security
Access tokens are stored only in memory on the frontend (in Zustand store, not localStorage). Refresh tokens are in httpOnly cookies. This means XSS attacks cannot steal the access token because it is not in the DOM. CSRF protection is handled by the SameSite cookie attribute.
Cloudinary Upload Validation
Before uploading to Cloudinary, validate on the backend that the uploaded file is actually an image (check MIME type, not just extension). Limit file size to 5MB for profile photos and 10MB for clinic cover photos. Reject files with unexpected MIME types.
API Key Rotation
Keep all API keys in environment variables. Set calendar reminders every 90 days to rotate your JWT secrets and Cloudinary API keys. After rotating JWT secret, all existing tokens are immediately invalidated (all users get logged out), which is a security feature, not a bug.
GDPR and Data Privacy
Add a data privacy section in patient profile settings: "Download My Data" (generates and emails a JSON export of all their data), "Delete My Account" (anonymizes all their data: replaces name with "Deleted User", replaces phone with a hash, removes email and photo, keeps appointments for clinic records but with anonymized patient reference).

PART 49 — INTERNATIONALIZATION ADVANCED
Automatic Language Detection
On first app load, detect the browser's language using navigator.language. Map hi to Hindi, mr to Marathi, gu to Gujarati, everything else to English. Show a one-time banner: "We detected your language as Hindi. Switch to Hindi?" with Accept and Dismiss buttons.
Number and Currency Formatting
Use JavaScript's Intl.NumberFormat with the user's locale for displaying numbers and currency. In Hindi locale, numbers format differently (10,00,000 instead of 1,000,000). Currency always shows in INR with the ₹ symbol.
Date and Time Formatting
Use Intl.DateTimeFormat with the locale for dates. In Marathi, "सोमवार, १५ जानेवारी २०२६" instead of "Monday, 15 January 2026". The date picker shows day names in the selected language.
Right-to-Left Preparation
Even though current languages are LTR, structure your CSS using logical properties (margin-inline-start instead of margin-left) so adding Urdu or Arabic support in the future requires only adding an RTL stylesheet, not rewriting layout code.

PART 50 — MONITORING AND ERROR TRACKING
Error Tracking with Sentry
Install Sentry on both frontend and backend. npm install @sentry/react and npm install @sentry/node. Initialize Sentry with your DSN from sentry.io (free tier available). Sentry automatically captures all uncaught errors and shows them in a dashboard with the stack trace, the user who experienced it, the browser, and the steps to reproduce. Set up Slack alerts so critical errors notify you immediately.
Uptime Monitoring
Use Better Uptime (free tier) to ping your backend health check endpoint (GET /api/health which returns { status: 'ok', timestamp: new Date() }) every 60 seconds. If it fails 3 times in a row, you get an SMS and email alert.
Performance Monitoring
On the frontend, use the Web Vitals library (npm install web-vitals) to measure LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift). Send these metrics to your backend analytics endpoint. Target: LCP under 2.5 seconds, CLS under 0.1.
Analytics Dashboard (Internal)
Track these events using a simple Events collection in MongoDB: app_opened, search_performed, clinic_viewed, doctor_viewed, booking_started, booking_completed, booking_cancelled, whatsapp_bot_used. Use these to calculate your funnel: how many users who search actually complete a booking. This is your most important product metric.

PART 51 — MOBILE APP WRAPPING (OPTIONAL)
If you want actual iOS and Android apps without rewriting everything, wrap your React PWA with Capacitor.
Install @capacitor/core and @capacitor/cli. Run npx cap init. Add iOS and Android platforms with npx cap add ios and npx cap add android. Build your React app, then npx cap sync. Open the native project in Xcode or Android Studio.
With Capacitor you get access to native features: use @capacitor/push-notifications for true native push notifications instead of FCM web push. Use @capacitor/haptics for real haptic feedback. Use @capacitor/geolocation for better location accuracy. Use @capacitor/camera for taking profile photos directly from the camera. The app looks and behaves identically to the web version but runs as a real app in the App Store and Play Store.

PART 52 — FINAL DEPLOYMENT AND SCALING ARCHITECTURE
Production Infrastructure
For a platform expecting serious traffic, move beyond Railway free tier. Use these services. MongoDB Atlas M10 dedicated cluster for production (₹6000/month but handles millions of documents). Redis Cloud free tier for session caching and rate limiting state (use express-rate-limit with Redis store so rate limits persist across server restarts). Cloudinary free tier handles 25GB storage and 25GB monthly bandwidth, upgrade when needed. Vercel Pro for the frontend eliminates cold starts. Railway Starter plan for the backend gives you consistent uptime.
CDN for Static Assets
All images served from Cloudinary already get CDN benefits. For your React app's JS and CSS bundles, Vercel automatically distributes them to their global edge network. Your app loads fast from anywhere in India because Vercel has an edge in Mumbai.
Horizontal Scaling
When your booking API gets high traffic, you may need multiple backend instances. Ensure your backend is stateless: do not store any user state in memory on the server. All state is in MongoDB or Redis. This means you can run 5 instances of your backend behind a load balancer and any request can go to any instance.
Database Backup
MongoDB Atlas automated backups are included. Set daily snapshots with 7-day retention. Before any major deployment, manually trigger a snapshot. Test restoration quarterly.
Launch Checklist
All environment variables set in production. HTTPS enabled on all URLs. CORS set to production frontend URL only. WhatsApp webhook registered with Twilio production number. Razorpay in live mode (not test mode). Email sending tested from production. Push notification FCM credentials are production credentials. Sentry connected and receiving events. Uptime monitor configured. Rate limiting tested. All API keys have been regenerated from the development phase to keep dev and production separate.


Doctor Clinic Booking Platform — Landing Page, Subscriptions & Monetization
PART 53 Onwards — Complete Implementation Guide

PART 53 — LANDING PAGE ARCHITECTURE AND STRUCTURE
The landing page is the most important page of your entire platform. It is the first thing investors, clinic owners, and patients see. It must communicate value in under 5 seconds, build trust, and convert visitors into signups. You are building something that looks like a combination of Practo's landing page, Stripe's design quality, and Zomato's energy.
Technical Setup for Landing Page
The landing page lives at the root URL of your domain. Create a separate folder inside your client's pages folder called landing. Inside it create these files: LandingPage.jsx as the main file that imports all sections, HeroSection.jsx, HowItWorksSection.jsx, FeaturesSection.jsx, StatsSection.jsx, DoctorShowcaseSection.jsx, TestimonialsSection.jsx, PricingSection.jsx, ClinicCTASection.jsx, FAQSection.jsx, FooterSection.jsx.
The landing page route is / but only when the user is not logged in. In your App.jsx router logic, check if the user is logged in using the Zustand auth store. If logged in, / goes to the patient home page. If not logged in, / shows the landing page. This means the same URL works for both.
The landing page does NOT use the patient app layout. It has its own full-width layout with no bottom nav bar and no 480px container restriction. It uses the full browser width like a real website.
Landing Page Color and Font Decisions
Use Inter as your primary font loaded from Google Fonts. It is professional, medical-adjacent, and extremely readable. Your primary color is #0EA5E9 (sky blue, same as the app). Your secondary color is #6366F1 (indigo, used as accent for pricing and highlights). Your success color is #10B981 (emerald green for checkmarks and positive indicators). Background in light mode is pure white with #F0F9FF (light sky blue) for alternating sections. Background in dark mode is #0A0F1E (very dark navy blue, not pure black, gives a premium medical feel).

PART 54 — HERO SECTION
The hero section is what visitors see without scrolling. Everything important must be here.
Layout
Full viewport height (100vh) on desktop, auto height on mobile. Split into two halves on desktop. Left half has the text content. Right half has the app mockup visual. On mobile, stack them vertically with text on top and mockup below.
Left Side Content
Start with a small pill-shaped badge at the very top with a sparkle emoji: "India's Fastest Growing Clinic Booking Platform". This badge has a subtle animated shimmer effect sweeping across it. Use a CSS keyframe that moves a light gradient from left to right on repeat.
Below the badge, the main headline in very large bold text (64px on desktop, 36px on mobile): "Book Doctor Appointments in Minutes, Not Hours." The word "Minutes" is highlighted with the teal accent color and has an underline drawn with an SVG wavy line underneath it, animated to draw itself when the page loads using Framer Motion's pathLength animation.
Below the headline, a subheading paragraph in gray: "Find verified doctors near you, check real-time slot availability, and confirm your booking in 3 taps. Available on web and WhatsApp. No app download needed."
Below the subheading, two buttons side by side. First button is large, teal background, white text: "Book Your First Appointment Free". Second button is white background with teal border and teal text with a play icon: "Watch How It Works". The watch button, when clicked, opens a modal with an embedded YouTube demo video.
Below the buttons, a social proof strip showing three small circular profile photos overlapping each other (use real-looking placeholder avatars) followed by the text "Join 50,000+ patients already using ClinicBook". The number counts up from 0 to 50,000 using a number counter animation when the section scrolls into view using IntersectionObserver.
Below the social proof, three small trust icons: a green shield "SSL Secured", a blue star "4.8 App Rating", a lock "HIPAA Compliant Guidelines".
Right Side — App Mockup Visual
Show a phone frame (a rounded rectangle SVG in dark gray representing a phone chassis) containing a screenshot of your actual app's home page. The phone is slightly tilted at about 10 degrees using CSS transform. Behind the phone, show abstract circular gradient blobs in teal and indigo with heavy blur (CSS filter: blur(80px)) that give a glowing background effect popular in premium app landing pages.
On top of the phone mockup, add floating mini cards that appear in different positions around the phone. One card shows a green checkmark and "Appointment Confirmed" with a doctor name, positioned to the upper left of the phone, slightly overlapping. Another card shows a star rating "4.9 ⭐ Dr. Priya Sharma", positioned to the lower right. Another card shows a WhatsApp green icon and "Book via WhatsApp", positioned to the upper right. These cards float using a CSS animation with translateY moving up and down 8 pixels slowly and continuously. Each card starts its animation at a different delay so they all float at different phases creating a living, breathing hero section.

PART 55 — STATS AND TRUST SECTION
Immediately below the hero, a full-width section with a light teal background. Four stat blocks side by side (two by two on mobile). Each block shows a large animated counter number and a label below.
First stat: "50,000+" with label "Happy Patients". Second stat: "1,200+" with label "Verified Doctors". Third stat: "350+" with label "Partner Clinics". Fourth stat: "4.8 / 5" with label "Average Rating".
Each number uses the counter animation: it counts up from 0 when the section scrolls into view. Implement this with useEffect and IntersectionObserver. When the element enters the viewport, start a setInterval that increments the displayed number by a calculated step every 20 milliseconds until it reaches the target. Stop the interval when the target is reached.
Below the four stats, a scrolling ticker of city names showing where the platform operates: "Mumbai · Delhi · Bengaluru · Pune · Hyderabad · Chennai · Ahmedabad · Jaipur · Kolkata · Surat ·" repeating infinitely. Use CSS animation: scroll-left linear infinite on a flex container with the cities duplicated twice so the loop is seamless.

PART 56 — HOW IT WORKS SECTION
A step-by-step section explaining the patient booking journey. Background is white.
Section Header
Centered: small label text "Simple Process", large heading "Book in 3 Simple Steps", subtext "No phone calls, no waiting, no confusion."
Steps Layout
On desktop, three columns side by side connected by dotted arrows between them. On mobile, three steps stacked vertically with a vertical dotted line on the left connecting them.
Step 1: A circular icon with number 1 in teal, icon of a phone with location pin, heading "Find Nearby Clinics", description "Share your location and instantly see verified clinics and available doctors within 5km of you." Below the description, a small animated app screenshot showing the map view, auto-playing a subtle parallax scroll effect.
Step 2: Number 2, calendar and clock icon, heading "Choose Your Slot", description "See real-time availability, pick a date and time that works for you, and choose between in-person or video consultation." Small screenshot showing the slot picker.
Step 3: Number 3, checkmark icon, heading "Confirm and Done", description "Get instant confirmation on WhatsApp and in the app. Receive reminders before your appointment." Small screenshot showing the success screen.
Below the three steps, add a fourth step shown differently, in a highlighted teal card: "Also works on WhatsApp! No app needed. Just send 'Hi' to our WhatsApp number." with the WhatsApp logo and the phone number.

PART 57 — FEATURES SHOWCASE SECTION
This is the largest section on the landing page. It shows every major feature of the platform in detail. Background alternates between white and very light gray for visual separation.
Feature Block 1 — Real-Time Slot Booking
Left side has an animated app mockup showing the slot picker with slots appearing one by one. Right side has the text. Heading: "Know Exactly When the Doctor is Free." Body: "No more calling the clinic and being put on hold. Our real-time slot system shows you every available slot for every doctor, updated live. Two people can never book the same slot." Below the text, three bullet points with checkmark icons: "Live availability, no double bookings", "Slots update the moment someone books", "Automatic reminders so you never miss".
Feature Block 2 — WhatsApp Booking Bot
Right side has a mockup of a WhatsApp chat showing the bot conversation. Left side has text. Heading: "Book Through WhatsApp Without Downloading Anything." Body: "Our intelligent WhatsApp bot speaks your language — Hindi, English, Marathi, Gujarati. Share your location, pick a doctor, confirm your slot. The whole booking takes under 2 minutes." Show the WhatsApp chat mockup as a real-looking iPhone screenshot with actual chat bubbles.
Feature Block 3 — Video Consultations
Left side shows a mockup of the video call UI with two faces in a split screen. Right side has text. Heading: "Consult From Your Sofa." Body: "Not every issue needs a clinic visit. Connect face-to-face with doctors via HD video call. Prescriptions sent digitally. Follow-ups at half the price."
Feature Block 4 — Health Records Vault
Right side shows a mockup of the prescriptions list. Left side has text. Heading: "All Your Health Records in One Place." Body: "Store prescriptions, lab reports, and scan results securely. Share them instantly with any doctor during your consultation. Accessible from your phone anytime."
Feature Block 5 — Multi-Language Support
Show four phone mockups side by side each showing the app in a different language. Heading: "Speaks Your Language." Body: "Full support for English, Hindi, Marathi, and Gujarati — in every part of the app and in the WhatsApp bot. Switch languages anytime in settings."

PART 58 — DOCTOR AND CLINIC SHOWCASE SECTION
Show real verified doctors and clinics from your platform (use seeded fake data initially). This builds trust.
Section Header
"Meet Our Verified Doctors" with a subtext "Every doctor on our platform is manually verified by our team."
Doctor Cards Row
Horizontal scrollable row of doctor cards on mobile, a 3 or 4 column grid on desktop. Each card shows the doctor's photo, a verified badge, name, specialty, hospital name, years of experience, rating with stars, and a "View Profile" button. Cards are the same design as in the app for consistency.
Clinic Feature Cards
Below the doctors, show 3 featured clinics as larger cards with their cover photo, name, city, specialties, rating, number of doctors, and an "Explore Clinic" button.
Trust Badges Row
Below the clinics, a row showing: "All doctors verified by medical council registration number", "Clinic premises physically inspected by our team", "Patient reviews are from verified appointments only." Each with an icon.

PART 59 — TESTIMONIALS SECTION
Social proof from real patients and clinic owners. Background is a dark navy color to create visual contrast.
Section Header
White text: "What Our Users Are Saying". Subtext in light gray: "Over 10,000 five-star reviews and counting."
Testimonial Cards
Three columns on desktop, one on mobile with swipe to navigate. Each card is dark gray with a slight blue tint. Shows: five gold stars at top, the testimonial quote in white, a horizontal rule, the person's photo (circular), name, city, and role (Patient or Clinic Owner).
Example testimonials: "I used to spend 45 minutes calling clinics every morning. Now I book in 2 minutes on my way to office." — Rahul Mehta, Mumbai, Patient. "Since listing our clinic on ClinicBook, we've seen a 40% increase in new patient footfall." — Dr. Priya Clinic, Pune, Clinic Owner. "The WhatsApp bot is a game changer for my parents who are not tech-savvy." — Ananya Sharma, Delhi, Patient.
Auto-Rotating Carousel
On mobile, the testimonials auto-rotate every 5 seconds with a smooth slide animation. Show dot indicators below. The user can swipe left or right to manually navigate. Pause auto-rotation when the user is actively swiping.

PART 60 — PRICING SECTION (PATIENTS)
This section shows the patient subscription plans. Background is white with a subtle grid pattern.
Section Header
Centered: "Simple, Transparent Pricing" with subtext "Start for free. Upgrade when you need more."
Toggle
A pill-shaped toggle at the top that switches between Monthly and Yearly pricing. When yearly is selected, show a "Save 40%" badge. The price numbers animate to the new values when toggled using a number animation.
Three Plan Cards
Display three cards side by side on desktop, stacked on mobile.
Free Plan Card. Light gray background. Badge: "Get Started". Price: "₹0 / forever". Heading: "Basic". List of features with checkmarks: Up to 3 bookings per month, Search nearby clinics, Book via app and WhatsApp, Basic appointment reminders, View prescriptions. A grayed-out section at the bottom with features showing a lock icon: Priority Booking Slots, Video Consultations, Health Records Vault, Family Members (up to 5), AI Health Assistant, Detailed Analytics. Button: "Start Free" — solid gray.
Pro Plan Card. This card is larger than the others (scaled 1.05 using transform), has a teal gradient background, and a "Most Popular" badge at the top in gold with a small crown emoji. Price: "₹199 / month" (₹119 in yearly view). List of all Free features plus: Unlimited bookings, Priority Booking Slots (first access to newly opened slots), Video Consultations (up to 5 per month), Health Records Vault (up to 1GB storage), Family Members (up to 5 members), AI Health Assistant (50 queries per month), Exclusive member discounts at partner clinics (10% off). Button: "Start Pro Free for 14 Days" — white text on teal, bold.
Premium Plan Card. Light gradient from indigo to purple. Badge: "For Power Users". Price: "₹399 / month" (₹239 in yearly view). All Pro features plus: Unlimited video consultations, Health Records Vault (unlimited storage), AI Health Assistant (unlimited queries), Dedicated support on WhatsApp, Monthly health report generated by AI summarizing your visits, First access to new features, ClinicCash 2x multiplier (earn double points on every booking). Button: "Get Premium" — white background with indigo text.
Below all three cards, a small gray text: "All plans include a 14-day free trial. Cancel anytime. No credit card required for free plan."

PART 61 — CLINIC OWNER PRICING SECTION
A separate pricing section targeting clinic owners. This is where your main revenue comes from.
Section Header
Dark background. White heading: "For Clinics — Grow Your Practice Online". Subtext in light gray: "Join 350+ clinics earning more with ClinicBook."
Value Proposition Before Plans
Before showing prices, show a horizontal strip with three impact numbers: "Average clinic sees 40% more patients", "Save 3+ hours daily on phone booking management", "Zero setup fees, list your clinic today." Each with a large number and icon.
Four Clinic Plans
Starter Plan — ₹0 / month. For single-doctor clinics just starting out. 1 clinic listing, 1 doctor profile, up to 30 appointments per month via platform, Basic appointment management dashboard, Email support. Platform commission: 8% on each booking. No monthly fee but we take a higher commission.
Growth Plan — ₹1,499 / month. For established clinics. 1 clinic listing, up to 5 doctors, unlimited appointments, Full dashboard with analytics, WhatsApp bot integration, Custom clinic page URL, Patient broadcast messaging (2 per week), Priority listing in search results, Chat with patients, Prescription management. Platform commission: 4%. This is the sweet spot plan.
Professional Plan — ₹3,999 / month. For multi-specialty clinics or chains with a single location. Up to 15 doctors, Advanced analytics with CSV export, Video consultation for all doctors, Clinic branding customization (custom colors on their profile page), API access for EHR integration, Dedicated account manager, Priority customer support (4-hour response), Queue management system, Waitlist management. Platform commission: 2%.
Enterprise Plan — Custom Pricing. For clinic chains with multiple locations. Unlimited clinics under one account, Unlimited doctors, White-label options, Custom integration, Custom contract, Dedicated success manager, SLA guarantees. Button: "Contact Sales" which opens a lead capture form.
Below the plans, a table comparing all features across plans, collapsible on mobile (show first 8 rows then "Show all features" expander).

PART 62 — SUBSCRIPTION BACKEND IMPLEMENTATION
This is the complete technical implementation of the subscription system.
New Database Collections
Subscriptions Collection. Fields: _id, subscriberId (could be user ID or clinic owner ID), subscriberType (patient or clinicOwner), planId (reference to Plans collection), planName (string stored at subscription time), status (enum: trial, active, pastDue, cancelled, expired), billingCycle (monthly or yearly), currentPeriodStart (date), currentPeriodEnd (date), trialEndDate (date, 14 days after signup), cancelledAt (date), razorpaySubscriptionId (string), razorpayCustomerId (string), amount (number, what they pay), currency (INR), autoRenew (boolean, default true), createdAt, updatedAt.
Plans Collection. Fields: _id, name (like Free, Pro, Premium, Starter, Growth), targetType (patient or clinicOwner), monthlyPrice, yearlyPrice, features (array of feature strings), limits (object with keys like maxBookingsPerMonth, maxFamilyMembers, maxStorageGB, maxDoctors, maxAppointmentsPerMonth, platformCommissionPercent), isActive, stripePlanId (or Razorpay plan ID), createdAt.
Invoices Collection. Fields: _id, subscriptionId, subscriberId, amount, currency, status (paid, pending, failed), razorpayPaymentId, invoiceUrl (PDF link), dueDate, paidAt, createdAt.
Razorpay Subscription Setup
Razorpay supports recurring subscriptions natively. In your Razorpay dashboard, create Plans for each of your paid tiers. A plan has a period (monthly or yearly), amount, and currency. Copy the plan IDs and store them in your Plans collection.
When a patient or clinic owner clicks "Start Pro" or "Get Growth Plan", your backend creates a Razorpay customer if they do not have one (using their email and phone), then creates a Razorpay subscription linked to the plan and customer. Razorpay handles all the recurring billing automatically. They charge the customer every month and send webhooks to your server.
Webhook Handler for Razorpay Subscriptions
Create a POST route at /api/webhook/razorpay. Razorpay will send these events. subscription.activated — update subscription status to active. subscription.charged — payment succeeded, create an Invoice record, reset the period dates. subscription.payment.failed — update status to pastDue, send email and WhatsApp to the subscriber: "Your payment failed. Please update your payment method to keep your subscription active." subscription.cancelled — update status to cancelled. subscription.completed — subscription ended.
Always verify the webhook signature using HMAC SHA256 before processing any event.
Feature Gating Middleware
Create a middleware function called checkSubscriptionFeature(featureName) on the backend. This middleware takes a feature name like videoConsult or familyMembers. When called, it looks up the subscriber's active subscription and plan. It checks if that plan's features array includes the requested feature. If yes, call next(). If no, return a 403 response with a body containing { error: 'FEATURE_LOCKED', message: 'This feature requires a Pro or Premium plan', upgradeUrl: '/pricing' }.
Add this middleware to protected routes. For example, the video consultation booking route gets checkSubscriptionFeature('videoConsult') added to its middleware stack. The health records upload route gets checkSubscriptionFeature('healthRecordsVault'). The family members route gets checkSubscriptionFeature('familyMembers').
Booking Quota Enforcement
For the Free plan's 3 bookings per month limit, check on every booking creation. In the booking POST route, after authentication, count how many appointments the user has created this calendar month with status not cancelled. If count is greater than or equal to their plan's maxBookingsPerMonth, and the plan limit is not unlimited (store -1 for unlimited), return 403 with { error: 'QUOTA_EXCEEDED', message: 'You have reached your 3 bookings per month limit. Upgrade to Pro for unlimited bookings.' }.
Clinic Commission System
For clinic plans with a commission percentage, on every completed booking payment, calculate the commission. If a booking fee is ₹500 and the clinic is on Starter plan (8% commission), the commission is ₹40. Create a Commission record in your Commissions collection. Track this for monthly reconciliation. The clinic's analytics page shows their gross revenue and the platform fee separately.

PART 63 — SUBSCRIPTION FRONTEND IMPLEMENTATION
Pricing Page in the App
Create a /pricing page accessible from the patient profile settings and from the clinic owner dashboard. This page is separate from the landing page pricing section and is designed for logged-in users who are evaluating or managing their subscription.
Show the current plan prominently at the top: a teal card showing "Your Current Plan: Free" with usage statistics below (2 of 3 bookings used this month, 0 of 0 family members added). Below that, show the available upgrade options.
Upgrade Flow
When a user clicks "Upgrade to Pro", show a bottom sheet or a modal summarizing what they get. Show the plan features as a checklist with each item animated to check off one by one. Show the price. Show a 14-day free trial badge. Show a "Start Free Trial" button. When they tap it, open the Razorpay checkout modal for subscription sign-up (not one-time payment — Razorpay has a specific subscription checkout flow). After successful subscription setup, update the UI immediately without refresh using React Query's invalidateQueries.
Subscription Management Page
In patient profile settings, a "Manage Subscription" row. Tapping goes to /settings/subscription. This page shows: current plan name and status badge, next billing date and amount, billing history (last 6 invoices with a download button on each that opens the invoice PDF), a "Change Plan" button, and a "Cancel Subscription" button.
Cancel subscription shows a confirmation screen with an offboarding flow: first ask why they are cancelling (Too expensive, Not using it enough, Missing features, Switching to competitor, Other). Based on their reason, show a retention offer. If they say "Too expensive", show "We can offer you 3 months at 50% off. Stay for ₹99/month?". If they confirm cancellation, set cancelledAt in the database and set autoRenew to false. They keep access until the end of the current billing period.
Paywalled Feature UI
When a Free user encounters a locked feature in the app, show a bottom sheet rather than an error page. The bottom sheet has a lock icon at the top, the feature name, what it does, the plans it is available on, and an "Upgrade to Pro" button. This is a much better experience than an error message. Implement a custom hook called useFeatureAccess(featureName) that returns { hasAccess: boolean, requiredPlan: string }. Use this hook in any component that renders a locked feature.

PART 64 — LANDING PAGE SEO SECTION
FAQ Section
An accordion FAQ section on the landing page. Questions address the most common objections and searches. Include: "Is ClinicBook free to use?", "Do I need to download an app?", "How do I know the doctors are verified?", "Can I book via WhatsApp?", "What if I need to cancel my appointment?", "Is my health data secure?", "Which cities is ClinicBook available in?", "How does the subscription work?". Each question expands on click to show the answer. Use schema.org FAQ schema markup in a script tag for Google rich results, which shows your FAQ directly in Google search results.
SEO Metadata
In your index.html, add comprehensive meta tags. Title: "ClinicBook — Book Doctor Appointments Online | Find Verified Doctors Near You". Description: "Book appointments with verified doctors near you in under 2 minutes. Real-time slot availability, video consultations, WhatsApp booking. 50,000+ patients trust ClinicBook." Keywords meta tag with relevant terms. Open Graph tags for rich link previews on WhatsApp and social media: og:title, og:description, og:image (a custom social card image showing your app mockup), og:url, og:type.
Add a sitemap.xml in your public folder with all static URLs. Add a robots.txt that allows all crawlers. Add JSON-LD structured data for your organization and for the mobile app (using MobileApplication schema).
Dynamic SEO Pages
Create server-rendered (or statically generated) pages for high-value search terms. Pages like /book-doctor-mumbai, /cardiologist-near-me, /dermatologist-pune. These pages are pre-populated with real doctors and clinics filtered for that city or specialty. Since React is client-rendered, use React Helmet for dynamic meta tags and consider adding server-side rendering with a simple Express endpoint that injects meta tags for crawlers (Google crawls JavaScript pages but meta tag injection helps).

PART 65 — CLINIC OWNER LANDING SECTION
The landing page has a completely separate section targeted at clinic owners, positioned after the main patient sections.
Clinic Section Header
Dark navy background. Heading: "Are You a Doctor or Clinic Owner?" Subtext: "List your clinic for free and start receiving online bookings today."
Benefits Grid
Six benefit cards in a 3x2 grid. Each card has an icon, heading, and two-line description. Card 1: "Zero Setup Cost — List your clinic, add doctors, and start receiving bookings within 24 hours. No upfront payment." Card 2: "Smart Appointment Dashboard — Manage all bookings, confirmations, and cancellations from one screen. Works on any device." Card 3: "WhatsApp Integration — Patients book through WhatsApp and appointments appear in your dashboard automatically." Card 4: "Reduce No-Shows by 70% — Automated reminders to patients via WhatsApp and push notifications." Card 5: "Detailed Analytics — See which doctors are most popular, peak booking times, and monthly revenue charts." Card 6: "Grow Your Online Presence — Get a shareable clinic profile URL, appear in Google search results, collect verified reviews."
Clinic Owner Testimonials
Two large testimonial cards from clinic owners with their photo, clinic name, city, and a metric: "Our new patient bookings increased by 40% in the first month." — Dr. Mehta, City Care Clinic, Mumbai.
Clinic Registration CTA
A large teal button: "List My Clinic Free — Takes 10 Minutes". Clicking scrolls to or navigates to the clinic registration page.

PART 66 — LANDING PAGE ANIMATIONS AND POLISH
These animations are what separate a template-looking page from a premium product.
Scroll-Triggered Animations
Use Framer Motion's useInView hook and whileInView prop on every section. When a section scrolls into view, its content fades up from 20 pixels below using initial={{ opacity: 0, y: 20 }} and whileInView={{ opacity: 1, y: 0 }} with transition={{ duration: 0.5 }} and viewport={{ once: true }}. The once: true means the animation only plays once, not every time you scroll past the element. Stagger child elements using Framer Motion's staggerChildren in the parent's variants object so each child animates in 0.1 seconds after the previous.
Parallax Scrolling Effect
The hero section background blobs move at a different speed than the foreground when scrolling. Use Framer Motion's useScroll and useTransform hooks. Get the scroll progress. Map it to a y value for the blobs (they move slower than the scroll, creating depth). This single effect makes the hero look three-dimensional.
Sticky Navigation Bar
The landing page has a navigation bar at the top. On initial load it is transparent (background: transparent) and overlays the hero. When the user scrolls down more than 80 pixels, it transitions to a white background with a shadow using a CSS transition on background-color and box-shadow. This is called a sticky transparent nav and is used by every premium SaaS product. Implement with a useEffect that adds a scroll event listener and updates a isScrolled state variable.
Navigation Bar Content
Left: app logo and name. Center: navigation links "Features", "Pricing", "For Clinics", "Blog" — clicking each smooth-scrolls to the corresponding section on the page. Right: two buttons — "Login" (outlined) and "Get Started Free" (solid teal). On mobile, replace center links with a hamburger menu icon that opens a full-height slide-in drawer from the right.

PART 67 — LEAD CAPTURE AND GROWTH FEATURES
Email Waitlist for New Cities
In the stats section, below the scrolling city ticker, add: "Don't see your city? Join the waitlist." with an email input and "Notify Me" button. Submitting saves the email to a Waitlist collection with the approximate city (get city from IP using a free IP geolocation API). When you launch in a new city, send emails to everyone on the waitlist for that city.
Clinic Lead Form
When a clinic owner clicks "List My Clinic Free" from the landing page and they are not logged in, before taking them to the full registration form, show a shorter lead capture form with just: Name, Clinic Name, City, Phone, and Email. Save this as a ClinicLead document. Send an automated welcome email with a link to complete the full registration. This way even if they abandon the full registration, you have their contact info. Your sales team (just you initially) can follow up.
Newsletter Subscription in Footer
The footer has a newsletter signup section: "Get health tips and platform updates delivered to your inbox." Email input with subscribe button. Store emails in a NewsletterSubscribers collection. Send monthly emails using Nodemailer (or upgrade to SendGrid for better deliverability) with health articles from your blog and platform updates.
Blog SEO Content Strategy
Your blog is your organic traffic engine. Target these types of articles: "Best Cardiologists in Mumbai" (hyper-local, high-converting search term), "How to prepare for your first dermatology appointment", "What to expect during a video consultation", "Difference between general physician and internal medicine doctor". These articles bring patients who are actively looking to book.

PART 68 — FOOTER SECTION
The footer is large and informative, demonstrating that this is a serious company.
Footer Structure
Four column layout on desktop, stacked on mobile. Column 1: App logo, tagline "Your health, our priority", social media icons (Instagram, Twitter/X, Facebook, LinkedIn, YouTube — even if accounts are new, show them), App store download badges (add these when your app is on the stores, for now they can be disabled or show "Coming Soon").
Column 2 heading "For Patients": links to Features, Pricing, How It Works, Download App, Blog, Help Center.
Column 3 heading "For Clinics": links to List Your Clinic, Clinic Pricing, Clinic Dashboard Login, Partner Stories, Clinic Help.
Column 4 heading "Company": links to About Us, Careers (even if just showing "We are hiring — contact@clinicbook.com"), Press, Contact Us, Privacy Policy, Terms of Service, Refund Policy, Sitemap.
Below the four columns, a full-width divider. Below that, a row with copyright text on the left: "© 2026 ClinicBook Technologies Pvt. Ltd. All rights reserved." and on the right: "Made with ❤️ in India 🇮🇳". This India badge resonates strongly with the target audience.

PART 69 — ABOUT US, CONTACT, AND LEGAL PAGES
About Us Page
URL /about. Not part of the landing page but linked from the footer. Clean single-column layout telling the story of why you built ClinicBook. Start with "Our Mission" (connect every Indian to quality healthcare in under 2 minutes). Show the problem you are solving with a relatable story. Show team section (even with just your name and photo if solo, it humanizes the product). Show values as a grid (Trust, Privacy, Simplicity, Accessibility). Show a "We are hiring" section.
Contact Page
URL /contact. A simple form with Name, Email, Phone, Subject dropdown (Patient Support, Clinic Partner Inquiry, Press, Careers, Other), Message textarea, and Submit button. Submitting sends an email to your support address using Nodemailer and saves to a ContactSubmissions collection. Show a success message after submission: "We have received your message and will respond within 24 hours."
Privacy Policy and Terms Pages
URL /privacy and /terms. These are static pages with legal content. Get templates for Indian digital health platforms and customize them. These pages must be real and complete before launch. Indian law (IT Act 2000 and health data guidelines) requires clear privacy policies for apps that handle medical information.
Refund Policy Page
URL /refund. Explains your refund policy for subscriptions (cancel within 7 days for full refund, prorated after that) and for appointment bookings (full refund if cancelled 2 hours in advance, no refund after that). This builds trust and is legally required when you accept payments.

PART 70 — MONETIZATION SUMMARY AND REVENUE PROJECTIONS
Here are all the revenue streams your platform has and how to think about them.
Revenue Stream 1 — Patient Subscriptions
Free patients generate zero direct revenue but grow your user base. Pro patients at ₹199/month and Premium at ₹399/month are your direct consumer revenue. If you have 1,000 Pro patients and 200 Premium patients, monthly revenue from patients alone is ₹199,000 plus ₹79,800 equals ₹278,800 per month.
Revenue Stream 2 — Clinic Subscriptions
This is your primary revenue. Growth plans at ₹1,499/month and Professional at ₹3,999/month. If you have 100 Growth clinics and 30 Professional clinics, monthly revenue is ₹149,900 plus ₹119,970 equals ₹269,870 per month from subscriptions alone.
Revenue Stream 3 — Platform Commission
On bookings processed through the platform (for clinics on free or lower plans), you earn 4-8% commission. If your platform processes ₹50,00,000 in bookings per month and average commission is 5%, that is ₹2,50,000 per month in commission revenue.
Revenue Stream 4 — Featured Listings
Charge clinics a one-time or monthly fee to appear at the top of search results in their city and specialty. A featured listing fee of ₹999 per month per city. 50 clinics paying this is ₹49,950 per month.
Revenue Stream 5 — Video Consultation Revenue Share
When doctors on your platform do paid video consultations through your system, you take a 10-15% platform fee on the consultation amount.
Revenue Stream 6 — Health Insurance Tie-ups
In a later stage, partner with health insurance companies. When a patient books a consultation that is covered by their insurance, the insurance company pays you and you handle the billing. Take a processing fee.
Launch Strategy
Month 1-3: Free for everyone. Focus on acquiring clinics and patients. Month 4: Launch paid plans with heavy discounts (₹99/month for Growth instead of ₹1,499 for early partners). Month 7: Full pricing. By month 12, target 200 paying clinics and 2,000 paying patients for total monthly recurring revenue of approximately ₹4-5 lakh.
