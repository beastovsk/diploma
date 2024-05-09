import { FaServer, FaNetworkWired, FaHeadset, FaSms, FaHandshake, FaToolbox, FaBuilding, FaCar } from 'react-icons/fa';
import s from './advantages.module.scss';

export const Advantages = () => {
    return (
        <div className={s.advantages}>
            <h2 className={s.heading}>HOMELINE - ИНТЕРНЕТ ПРОВАЙДЕР В КЫРГЫЗСТАНЕ С 2005 ГОДА</h2>
            <div className={s.advantage}>
                <FaServer className={s.icon} />
                <p>Проверенное, высокотехнологичное оборудование</p>
            </div>
            <div className={s.advantage}>
                <FaNetworkWired className={s.icon} />
                <p>Подключаем интернет в течение 1-2 дней</p>
            </div>
            <div className={s.advantage}>
                <FaHeadset className={s.icon} />
                <p>Круглосуточная техподдержка</p>
            </div>
            <div className={s.advantage}>
                <FaSms className={s.icon} />
                <p>Бесплатное SMS-информирование</p>
            </div>
            <div className={s.advantage}>
                <FaHandshake className={s.icon} />
                <p>Обещанный платеж</p>
            </div>
            <div className={s.advantage}>
                <FaToolbox className={s.icon} />
                <p>Бесплатная пристановка</p>
            </div>
            <div className={s.advantage}>
                <FaBuilding className={s.icon} />
                <p>Офис в каждом городе</p>
            </div>
            <div className={s.advantage}>
                <FaCar className={s.icon} />
                <p>Быстрый выезд инженеров на неисправность</p>
            </div>
        </div>
    );
}
