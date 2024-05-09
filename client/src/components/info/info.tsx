import s from './info.module.scss';

export const Info = () => {
    return (
       <div className={s.infoBase}>
            <div className={s.left}>
                <img src='https://homeline.kg/wp-content/uploads/2020/11/call.jpg' alt="Интернет-сервис" className={s.image}/>
            </div>
            <div className={s.right}>
                <h2 className={s.title}>Подключите интернет</h2>
                <p>Оставьте Заявку на бесплатное подключение* по Кыргызстану!<br/> Выгодные тарифы, сеть построенная на оборудовании премиум<br/> класса, круглосуточная техническая поддержка, интересные акции.</p>
                <button type="submit" className={`${s.button} ${s.activeButton}`}>
                    Оформить заявку
                </button>
            </div>
       </div>
    );
}
