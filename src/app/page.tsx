import ApiCard1 from "@/components/landing/ApiCard1";
import ApiCard2 from "@/components/landing/ApiCard2";
import ApiKey from "@/components/landing/ApiKey";
import CoinCreation from "@/components/landing/CoinCreation";
import CoinHeading from "@/components/landing/CoinHeading";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Liquidity from "@/components/landing/Liquidity";
import Partners from "@/components/landing/Partners";
import RegisterCompany from "@/components/landing/RegisterCompany";
import VerticalDashedLayout from "@/components/landing/VerticalDashedLayout";
import WalletHero from "@/components/landing/Wallet";
import AnimateGSAP from '@/components/AnimateGSAP';

export default function Home() {
  return (
    <div>
      <section id="hero">
        <AnimateGSAP>
          <HeroSection />
        </AnimateGSAP>
      </section>

      <VerticalDashedLayout>
        <section id="wallet">
          <AnimateGSAP>
            <WalletHero />
          </AnimateGSAP>
        </section>

        <section id="api">
          <AnimateGSAP>
            <ApiKey />
          </AnimateGSAP>
          <AnimateGSAP>
            <ApiCard1 />
          </AnimateGSAP>
          <AnimateGSAP>
            <ApiCard2 />
          </AnimateGSAP>
        </section>

        <section id="coin-creation">
          <AnimateGSAP>
            <CoinHeading />
          </AnimateGSAP>
          <AnimateGSAP>
            <CoinCreation />
          </AnimateGSAP>
        </section>

        <section id="partners">
          <AnimateGSAP>
            <Partners />
          </AnimateGSAP>
        </section>

        <section id="liquidity">
          <AnimateGSAP>
            <Liquidity />
          </AnimateGSAP>
        </section>

        <section id="register-company">
          <AnimateGSAP>
            <RegisterCompany />
          </AnimateGSAP>
        </section>
      </VerticalDashedLayout>

      <Footer />
    </div>
  );
}
