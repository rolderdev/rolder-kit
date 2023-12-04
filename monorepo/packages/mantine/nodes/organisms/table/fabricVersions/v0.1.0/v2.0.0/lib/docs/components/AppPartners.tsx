import { Container, Text, createStyles } from '@mantine/core';

const PARTNERS = [
  {
    name: 'kappa.ai',
    logo: { base: 'kapa', ext: 'png', themed: true, scale: 98, shift: 1 },
    link: 'https://kapa.ai',
  },
  {
    name: 'exdatis',
    logo: { base: 'exdatis', ext: 'svg', themed: true, scale: 92, shift: 2 },
    link: 'https://exdatis.ai',
  },
  {
    name: 'teachfloor',
    logo: { base: 'teachfloor', ext: 'svg', themed: true },
    link: 'https://www.teachfloor.com',
  },
  {
    name: 'MARKUP',
    logo: { base: 'markup', ext: 'png', themed: true, scale: 72 },
    link: 'https://www.getmarkup.com',
  },
  {
    name: 'InvenTree',
    logo: { base: 'inventree', ext: 'png', themed: true, scale: 140, shift: 1 },
    link: 'https://inventree.org',
  },
  {
    name: 'BookieBase',
    logo: { base: 'bookiebase', ext: 'svg', themed: true, scale: 72, shift: 2 },
    link: 'https://bookiebase.ie',
  },
  {
    name: 'Zipline',
    logo: { base: 'zipline', ext: 'png' },
    link: 'https://zipline.diced.sh',
  },
  {
    name: 'Pachtop',
    showText: true,
    logo: { base: 'pachtop', ext: 'png', scale: 84, shift: 2 },
    link: 'https://github.com/pacholoamit/pachtop',
  },
  {
    name: 'Ganymede',
    showText: true,
    logo: { base: 'ganymede', ext: 'png', scale: 82, shift: 2 },
    link: 'https://github.com/Zibbp/ganymede',
  },
  {
    name: 'COH3 Stats',
    showText: true,
    logo: { base: 'coh3-stats', ext: 'png', scale: 80, shift: 1 },
    link: 'https://coh3stats.com',
  },
  {
    name: 'ccrentals.org',
    showText: true,
    logo: { base: 'ccrentals', ext: 'svg', themed: true, scale: 84, shift: 1 },
    link: 'https://www.ccrentals.org',
  },
];

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: '2.5em',
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    padding: `0 ${theme.spacing.md}`,
  },
  title: {
    textAlign: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    fontSize: '1.125em',
    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      fontSize: '1.25em',
    },
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      gap: theme.spacing.xl,
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    height: 24,
    textDecoration: 'none',
    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      height: 36,
    },
  },
  text: {
    fontWeight: 700,
    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      marginTop: -4,
      fontSize: '1.25rem',
    },
  },
}));

export default function AppPartners() {
  const {
    classes,
    theme: { colorScheme },
  } = useStyles();
  return (
    <div className={classes.root}>
      <h2 className={classes.title}>Mantine DataTable is trusted by</h2>
      <Container className={classes.links}>
        {PARTNERS.map(({ name, logo: { base, ext, themed, scale, shift }, link, showText }) => (
          <a
            key={name}
            className={classes.link}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title={`${name} is using Mantine DataTable`}
          >
            <img
              style={{ height: `${scale || '100'}%`, marginTop: shift ? `-${shift}%` : undefined }}
              src={`${process.env.BASE_PATH}/partners/${base}${themed ? `-${colorScheme}` : ''}.${ext}`}
              alt={name}
            />
            {showText && (
              <Text color="dimmed" size="md" className={classes.text}>
                {name}
              </Text>
            )}
          </a>
        ))}
      </Container>
    </div>
  );
}
