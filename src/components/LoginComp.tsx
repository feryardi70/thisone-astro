import { useState, useEffect } from "react";

export default function SignIn() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const formAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //console.log(formState);
      if (!formState.email || !formState.password) {
        setError("email and password are required");
        setLoading(false);
        return;
      }

      const result = await fetch("https://thisone-astro.netlify.app/api/login.json", {
        //   const result = await fetch("http://localhost:4321/api/login.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
        credentials: "include", // Include cookies if needed
      });

      const responseData = await result.json();
      //console.log("Response from fetch:", responseData);

      if (result.ok) {
        alert("Login Successfull");
        window.location.href = "/ctdi";
      } else {
        const data = await result.json();
        console.error("Login failed:", data.error);
        setError("An error occurred during login. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setError("Wrong email and password combination");
      console.error("Error:", error);

      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="mx-5 my-5 min-h-[100%]">
      <div className="mt-10 flex justify-evenly w-full rounded-lg">
        <div className="min-w-[600px] min-h-[450px] mt-10 bg-blue-950 m-5 p-5 flex flex-col justify-center items-center">
          <div>{error && <p className="text-red-500 mt-4 px-5 mb-4 text-xl font-extrabold">{error}</p>}</div>
          <h1 className="mb-10 text-5xl">Form Login</h1>
          <form onSubmit={formAction}>
            <div className="flex flex-col">
              <label className="text-lg" htmlFor="email">
                Email
              </label>
              <input className="border mb-1 pl-1 py-2 w-80 text-blue-950" name="email" id="email" type="email" placeholder="your email" required value={formState.email} onChange={handleChange} />
              <label className="text-lg" htmlFor="password">
                Password
              </label>
              <input className="border mb-1 pl-1 py-1 w-80 text-blue-950" name="password" id="password" type="password" placeholder="********" required value={formState.password} onChange={handleChange} />
              <button className="mt-4 bg-fuchsia-400 text-xl py-1" type="submit" disabled={loading}>
                {loading ? "Authenticating..." : "Login"} {/* Show loading text */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
