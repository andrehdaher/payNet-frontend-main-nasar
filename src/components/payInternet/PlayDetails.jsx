import Pubg from '../../assets/pubg.jpeg'
import Freefire from '../../assets/freefire.jpeg'
import Pubgtr from '../../assets/pubgtr.jpeg'
import Ballbool8 from '../../assets/ball-bool8.jpeg'
import Clashclans from '../../assets/clash-clans.jpeg'
import Clashroyall from '../../assets/clash-royall.jpeg'
import Jawaker from '../../assets/jawaker.jpeg'
import KnivesOut from '../../assets/knives-out.jpeg'
import Ludo from '../../assets/ludo.jpeg'
import MobileLegend from '../../assets/mobile-leg.jpeg'
import ProjectEntropy from '../../assets/ProjectEntropy.jpeg'
import without from '../../assets/without.jpeg'
import { useNavigate } from 'react-router-dom';

export default function PlayDetails() {
    const navigate = useNavigate();

    const playDetails = [
        {
            title: "شحن pubg mobile",
            formType: "pubg",
            description: "شحن حسابات لعبة pubg mobile بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Pubg
        },
        {
            title: "شحن pubg turkey",
            formType: "pubgtr",
            description: "شحن حسابات لعبة pubg turkey بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Pubgtr
        },
        {
            title: "شحن free fire",
            formType: "freefire",
            description: "شحن حسابات لعبة فري فاير-free fire بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Freefire
        },
        {
            title: "شحن ball pool 8",
            formType: "ballpool8",
            description: "شحن حسابات لعبة ball pool 8 بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Ballbool8
        },
        {
            title: "شحن clash of clans",
            formType: "clashclans",
            description: "شحن حسابات لعبة clash of clans بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Clashclans
        },
        {
            title: "شحن clash royal",
            formType: "clashroyal",
            description: "شحن حسابات لعبة clash royal بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Clashroyall
        },
        {
            title: "شحن جواكر بشكل يدوي",
            formType: "jawakerman",
            description: "شحن حسابات لعبة جواكر-jawaker بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Jawaker
        },
        {
            title: "شحن جواكر",
            formType: "jawaker",
            description: "شحن حسابات لعبة جواكر-jawaker بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Jawaker
        },
        {
            title: "شحن knives out",
            formType: "knivesout",
            description: "شحن حسابات لعبة knives out بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: KnivesOut
        },
        {
            title: "شحن ludo king",
            formType: "ludoking",
            description: "شحن حسابات لعبة ludo king بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: Ludo
        },
        {
            title: "شحن mobile legend",
            formType: "mobilelegend",
            description: "شحن حسابات لعبة mobile legend بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: MobileLegend
        },
        {
            title: "شحن project entropy",
            formType: "projectentropy",
            description: "شحن حسابات لعبة project entropy بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: ProjectEntropy
        },
        {
            title: "شحن whithout ",
            formType: "whithoutsurvivial",
            description: "شحن حسابات لعبة whithout survivial بسرعة وأمان.",
            buttonText: "عرض التفاصيل",
            Action: (formType) => { navigate('/payinternet', { state: formType }) },
            image: without
        },
    ];

    return playDetails; // إرجاع الـ array

}