import imgCardLogo from "./b8281fb1388b1491eb9333e796869f793816678a.png";

export default function CardLogo() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[22px] size-full" data-name="card-logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[22px] size-full" src={imgCardLogo} />
    </div>
  );
}