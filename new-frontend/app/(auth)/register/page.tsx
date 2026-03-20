// "use client";

// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";

// export default function Register() {

//   const [email,setEmail]=useState("");
//   const [password,setPassword]=useState("");

// const handleRegister = async () => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );

//     const user = userCredential.user;

//     console.log("Firebase user:", user);

//     alert("Register success");

//   } catch (error: any) {
//     console.error(error);
//     alert(error.message);
//   }
// };

//   return (

//     <div>

//       <h1>Register</h1>

//       <input
//         placeholder="Email"
//         onChange={(e)=>setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e)=>setPassword(e.target.value)}
//       />

//       <button onClick={handleRegister}>
//         Register
//       </button>

//     </div>

//   );
// }

import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage(){
  return(
    <div className="flex justify-center items-center h-screen">
      <RegisterForm/>
    </div>
  )
}