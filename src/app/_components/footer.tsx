import Link from "next/link";

export function Footer() {
  return (
    <div className="flex w-full justify-center px-4 py-8 text-center text-lg font-semibold">
      <span>
        Made by{" "}
        <Link
          href="https://blupm.dev"
          target="_blank"
          className="underline underline-offset-4"
        >
          blupandaman
        </Link>{" "}
        🔵🐼 and this repo can be found{" "}
        <Link
          href="https://github.com/blupandaman/web3-auth-starter"
          target="_blank"
          className="underline underline-offset-4"
        >
          here
        </Link>
      </span>
    </div>
  );
}
