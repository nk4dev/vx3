import Link from "next/link";
import Image from "next/image";

export default function About() {
    const linipath = (path: any) => {
        return path;
    }
    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-4">About</h1>
            <div className="max-w-3xl mx-auto px-4">
                <p className="mb-4">
                    Welcome to VX3, the all-in-one web3 platform developed by VARIUS. Our mission is to provide users with a seamless and secure experience in the world of decentralized applications and blockchain technology.
                </p>
                <p className="mb-4">
                    VX3 offers a comprehensive suite of tools and services designed to simplify your interaction with web3. Whether you're a developer looking to build decentralized applications or a user seeking to explore the benefits of blockchain, VX3 has you covered.
                </p>
                <p className="mb-4">
                    Key Features:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li className="mb-2">User-Friendly Interface: Our intuitive design ensures that both beginners and experienced users can navigate the platform with ease.</li>
                </ul>
                <p className="mb-4">
                    At VARIUS, we are committed to innovation and excellence. VX3 is continuously evolving, with new features and improvements being added regularly based on user feedback and industry trends.
                </p>
                <p className="mb-4">
                    Thank you for choosing VX3 as your gateway to the world of web3. We look forward to supporting your journey in this exciting new frontier
                </p>

            </div>
            <h1 className="text-center text-3xl font-bold my-4">Members</h1>
            <div>
                <div className="max-w-3xl mx-auto px-4">
                    <ul className="list-disc list-inside mb-4 list-none">
                        <li className="mb-2 flex items-center gap-2 flex-col">
                            <Image
                                src="https://nknighta.me/assets/img/myicon.jpeg"
                                alt="Nknight AMAMIYA"
                                width={100}
                                height={100}
                            />
                            Nknight AMAMIYA - Developer
                        </li>
                    </ul>
                </div>
            </div>
            <h1 className="text-center text-3xl font-bold my-4">Another Section</h1>
            <div className="max-w-3xl mx-auto px-4">
                <div>
                    <Link
                        className="underline text-center text-xl font-bold my-4"
                        href={linipath("/legal/license")}
                    >
                        License
                    </Link>
                </div>
                <div>
                    <Link
                        className="underline text-center text-xl font-bold my-4"
                        href={linipath("/legal/privacy-policy")}
                    >
                        Privacy Policy
                    </Link>
                </div>
                
            </div>
        </div>
    );
}