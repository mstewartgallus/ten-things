import { Time } from '../time';
import { P } from '../p';

import styles from './Complete.module.css';

interface Props {
    value: string;
    created: number;
    completed: number;
}

export const Complete = ({ value, created, completed }: Props) =>
    <>
        <P>{value}</P>
        <div className={styles.dates}>
            <span>Created: <Time>{created}</Time></span>
            <span>Completed: <Time>{completed}</Time></span>
        </div>
    </>;
