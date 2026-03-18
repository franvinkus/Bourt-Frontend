import { redirect } from 'next/navigation';
import Register from "./register/page";

export default function Home() {
    redirect('/homepage');
}
