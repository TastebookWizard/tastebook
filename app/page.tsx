import Link from "next/link";

import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen gap-y-8">
      <h1 className="font-semibold text-4xl text-center">This is the home page.</h1>
      <div className="flex gap-4">
        <Link href="/signup" className="focus:outline-none">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/login" className="focus:outline-none">
          <Button>Log In</Button>
        </Link>
      </div>
    </main>
  );
}
