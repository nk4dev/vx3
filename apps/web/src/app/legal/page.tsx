import Link from "next/link";

export default function Legal() {
    return (
        <div className="mx-auto max-w-2xl p-4">
            <h1 className="text-2xl font-bold">Legal</h1>
            <p>This is the Legal page.</p>
            <div>
                <Link href="/legal/privacy-policy" className="text-blue-500 hover:underline">
                    Privacy Policy
                </Link>
            </div>
            <div>
                <Link href="/legal/license" className="text-blue-500 hover:underline">
                    License
                </Link>
            </div>
        </div>
    )
}