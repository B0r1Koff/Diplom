import "./page.module.css";
import Auth from "./authorization/Authorization";

export default function Home() {
  return (
    <main className="app">
      <Auth></Auth>
    </main>
  );
}
