import Time from '../Time';
import P from '../P';

import styles from './Complete.module.css';

interface Props {
    value: string;
    created: number;
    completed: number;
}

const Complete = ({ value, created, completed }: Props) =>
    <>
        <div className={styles.complete}>
          <P>{value}</P>
        </div>
        <div className={styles.dates}>
            <span>Created: <Time>{created}</Time></span>
            <span>Completed: <Time>{completed}</Time></span>
        </div>
    </>;

export default Complete;
