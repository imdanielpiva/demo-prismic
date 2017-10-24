import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import UenoLogoSvg from 'assets/images/ueno-logo.svg';

import s from './Header.scss';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <header className={s.header}>
        <div className={s.header__container}>
          <div className={s.header__content}>
            <Link to="/" className={s.header__logo}>
              <UenoLogoSvg className={s.header__logoSvg} />
            </Link>

            <div className={s.header__navigation}>
              {this.props.children}
            </div>

            <div className={s.header__cta}>
              <button className={s.header__button}>Contact</button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
