/*
Copyright 2019 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Created by Patrick Simonian
*/

import React from 'react';
import PropTypes from 'prop-types';
import validUrl from 'valid-url';
import CardHeader from './CardHeader';

import {
  CardBody,
  Description,
  Image,
  ImageWrapper,
  LinkWrapper,
  Title,
  Container,
  DecorativeBar,
  EventbriteImageWrapper,
  MeetupImageWrapper,
  EventInfoDiv,
  EventDate,
  EventContainer,
} from './index';

import { RESOURCE_TYPES_LIST, RESOURCE_TYPES } from '../../constants/ui';
import EventLogo from '../Event/Logo';

const variants = {
  basic: 'basic', // title, description, normal card header
  imageOnly: 'imageOnly', // title, image, normal card header
  descAndImage: 'descAndImage', // title, desc, image, normal card header
  eventbrite: 'eventbrite', // title, desc, image, normal card header
  meetup: 'meetup', // title, desc, image, normal card header
};

/**
 * Basic building block to compose all other cards from
 * @param {Object} Props
 */
export const BaseCard = ({ resourceType, children, link, node, ...rest }) => (
  <LinkWrapper to={link}>
    <Container {...rest}>
      <DecorativeBar color={resourceType} />
      {children}
    </Container>
  </LinkWrapper>
);

BaseCard.propTypes = {
  resourceType: PropTypes.oneOf(RESOURCE_TYPES_LIST),
  link: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export const Card = ({
  resourceType,
  title,
  description,
  image,
  link,
  renderBody,
  renderHeader,
  node,
  ...rest
}) => {
  let isExternal = !!validUrl.isWebUri(link);
  let cardBody = null;
  let inferredVariant = 'basic';
  let clampAmount = 4;
  //if takes one line.......
  if (title.length < 23) {
    clampAmount = 5;
  }

  if (image === 'eventbrite') {
    inferredVariant = variants.eventbrite;
  } else if (image === 'meetup') {
    inferredVariant = variants.meetup;
  } else if (image && description) {
    inferredVariant = variants.descAndImage;
  } else if (!description && image) {
    inferredVariant = variants.imageOnly;
  } else if (!description) {
    description = 'No description found.';
  }

  // eslint-disable-next-line default-case
  switch (inferredVariant) {
    case variants.basic:
      cardBody = (
        <React.Fragment>
          <Description clamp={clampAmount} tagName="p">
            {description}
          </Description>
        </React.Fragment>
      );
      break;
    case variants.imageOnly:
      cardBody = (
        <React.Fragment>
          <ImageWrapper>
            <Image src={image} alt={title} />
          </ImageWrapper>
        </React.Fragment>
      );
      break;
    case variants.descAndImage:
      cardBody = (
        <React.Fragment>
          <Description title={description} clamp={2} tagName="p">
            {description}
          </Description>
          <ImageWrapper>
            <Image src={image} alt={title} />
          </ImageWrapper>
        </React.Fragment>
      );
      break;
  }

  if (inferredVariant === variants.eventbrite || inferredVariant === variants.meetup) {
    return (
      <EventCard
        resourceType={resourceType}
        image={image}
        title={title}
        description={description}
        event={node}
      />
    );
  } else {
    return (
      <BaseCard resourceType={resourceType} link={link} {...rest}>
        <CardBody>
          {renderHeader ? (
            renderHeader()
          ) : (
            <CardHeader resourceType={resourceType} linksToExternal={isExternal} />
          )}
          <Title>{title}</Title>
          {renderBody ? renderBody() : cardBody}
        </CardBody>
      </BaseCard>
    );
  }
};

Card.propTypes = {
  resourceType: PropTypes.oneOf(RESOURCE_TYPES_LIST),
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  renderBody: PropTypes.func,
  renderHeader: PropTypes.func,
  node: PropTypes.object,
};

Card.defaultProps = {
  description: null,
  image: null,
  node: {},
};

// used for eventbrite and meetup cards
export const EventCard = ({ title, description, image, link, event }) => {
  let cardBody = null;
  let clampAmount = 4;
  //if takes one line.......
  if (title.length < 23) {
    clampAmount = 5;
  }

  if (image === 'eventbrite') {
    cardBody = (
      <React.Fragment>
        <Description clamp={clampAmount} tagName="p">
          {description}
        </Description>
        <EventContainer>
          <EventDate>
            <span>{event.start.month}</span>
            {event.start.day}
            <small>{event.start.year}</small>
          </EventDate>
          <EventInfoDiv>
            <li>
              {event.venue !== null ? event.venue : 'tbd'}
              <EventbriteImageWrapper>
                <EventLogo type={image} />
              </EventbriteImageWrapper>
            </li>
          </EventInfoDiv>
        </EventContainer>
      </React.Fragment>
    );
  } else if (image === 'meetup') {
    cardBody = (
      <React.Fragment>
        <Description clamp={clampAmount} tagName="p">
          {description}
        </Description>
        <EventContainer>
          <EventDate>
            <span>{event.start.month}</span>
            {event.start.day}
            <small>{event.start.year}</small>
          </EventDate>
          <EventInfoDiv>
            <li>
              {event.venue !== null ? event.venue : 'tbd'}
              <MeetupImageWrapper>
                <EventLogo type={image} />
              </MeetupImageWrapper>
            </li>
          </EventInfoDiv>
        </EventContainer>
      </React.Fragment>
    );
  }

  return (
    <Card
      title={title}
      resourceType={RESOURCE_TYPES.EVENTS}
      renderBody={() => cardBody}
      link={link}
    />
  );
};

export default Card;
