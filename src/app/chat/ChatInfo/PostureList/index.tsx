import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import {
  Armchair,
  Bed,
  Dumbbell,
  GalleryVerticalEnd,
  Music2,
  PersonStanding,
  Sofa,
  Waves,
} from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { GenderEnum } from '@/types/agent';
import { PostureCategoryEnum } from '@/types/touch';

import ActionList from './ActionList';
import SideBar from './SideBar';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    height: 100%;
    padding: 0 ${token.paddingSM}px;

    background-color: rgba(255, 255, 255, 2%);
    border-radius: ${token.borderRadius}px;
  `,
}));

interface PostureListProps {
  className?: string;
  style?: React.CSSProperties;
}

const PostureList = memo((props: PostureListProps) => {
  const { style, className } = props;
  const { styles } = useStyles();
  const [currentGender, setCurrentGender] = useState<GenderEnum | undefined>(undefined);
  const [currentCategory, setCurrentCategory] = useState<PostureCategoryEnum | undefined>(
    undefined,
  );

  const { t } = useTranslation('role');

  const GENDER_OPTIONS = useMemo(
    () => [
      {
        label: t('gender.all'),
        value: undefined,
        icon: <GalleryVerticalEnd style={{ fontSize: 24 }} />,
      },
      {
        label: t('gender.female'),
        value: GenderEnum.FEMALE,
        icon: <WomanOutlined style={{ fontSize: 24 }} />,
      },
      {
        label: t('gender.male'),
        value: GenderEnum.MALE,
        icon: <ManOutlined style={{ fontSize: 24 }} />,
      },
    ],
    [],
  );

  const CATEGORY_OPTIONS = useMemo(
    () => [
      {
        label: t('touch.posture.all'),
        value: undefined,
        icon: <GalleryVerticalEnd style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.action'),
        value: PostureCategoryEnum.ACTION,
        icon: <Waves style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.standing'),
        value: PostureCategoryEnum.STANDING,
        icon: <PersonStanding style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.dance'),
        value: PostureCategoryEnum.DANCE,
        icon: <Music2 style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.laying'),
        value: PostureCategoryEnum.LAYING,
        icon: <Bed style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.sitting'),
        value: PostureCategoryEnum.SITTING,
        icon: <Armchair style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.crouch'),
        value: PostureCategoryEnum.CROUCH,
        icon: <Sofa style={{ fontSize: 24 }} />,
      },
      {
        label: t('touch.posture.locomotion'),
        value: PostureCategoryEnum.LOCOMOTION,
        icon: <Dumbbell style={{ fontSize: 24 }} />,
      },
    ],
    [],
  );

  return (
    <Flexbox horizontal className={classNames(className, styles.container)} style={style}>
      <SideBar
        currentGender={currentGender}
        setCurrentGender={setCurrentGender}
        genderOptions={GENDER_OPTIONS}
        categoryOptions={CATEGORY_OPTIONS}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />
      <ActionList
        currentGender={currentGender}
        currentCategory={currentCategory}
        style={{ marginLeft: 12 }}
      />
    </Flexbox>
  );
});

export default PostureList;
